using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;

using Newtonsoft.Json;

using Moments.Interfaces;
using Moments.Models;

namespace Moments
{
    public class Database : IDatabase
    {
        private readonly string _path;
        private readonly SortedDictionary<string, int> _allTags;
        private readonly SortedDictionary<long, Entry> _allEntries;
        private static long MaxId { set; get; }

        public List<Entry> Entries => _allEntries.Values.ToList();
        public List<string> Tags => _allTags.Keys.ToList();
        public Dictionary<string, int> TagsFrequencies => new Dictionary<string, int>(_allTags);

        private readonly Regex _entryRegex = new Regex("^[0-9]{8}-[0-9]{4}_[0-9]{6}[.]json$");

        public Database(string path)
        {
            _allTags = new SortedDictionary<string, int>();
            _allEntries = new SortedDictionary<long, Entry>();

            if (path[path.Length - 1] != '/')
                path += '/';

            _path = path;

            if (!Directory.Exists(path))
                throw new IOException($"Specified path {path} doesn't exist. Cannot load entries.");
        }

        private void ValidateEntry(Entry entry)
        {
            if (entry.EndTime.HasValue && entry.StartTime >= entry.EndTime)
                throw new InvalidDataException("Entry start time must come before end time.");
        }

        public Entry GetEntry(long id)
        {
            if (!_allEntries.ContainsKey(id))
                return null;

            return _allEntries[id];
        }

        public void AddOrUpdateEntry(Entry entry)
        {
            if (_allEntries.ContainsKey(entry.Id))
                ModifyEntry(entry);
            else
                AddEntry(entry);
        }
        
        private void AddEntry(Entry entry)
        {
            ValidateEntry(entry);

            while (_allEntries.ContainsKey(MaxId))
                MaxId++;

            entry.Id = MaxId;
            _allEntries.Add(entry.Id, entry);
            entry.Tags.ForEach(AddTag);
            
            UpdateLinksToEntries(entry);
            SaveEntry(entry);
        }

        private void ModifyEntry(Entry entry)
        {
            if (!_allEntries.ContainsKey(entry.Id))
                throw new ApplicationException("Could not found entry with id " + entry.Id);

            ValidateEntry(entry);

            var oldEntry = _allEntries[entry.Id];

            // Update tag information
            oldEntry.Tags
                .Where(oldTag => !entry.Tags.Contains(oldTag))
                .ToList()
                .ForEach(RemoveTag);

            entry.Tags
                .Where(newTag => !oldEntry.Tags.Contains(newTag))
                .ToList()
                .ForEach(AddTag);

            entry.Path = oldEntry.Path;
            entry.Private = oldEntry.Private;

            _allEntries[entry.Id] = entry;

            SaveEntry(oldEntry);
        }
 
        // Method saves given entry to file. If there's existing file for the given entry, it shall be deleted.
        public void SaveEntry(Entry entry)
        {
            // If (old) entry file exists, delete it.
            if (!String.IsNullOrEmpty(entry.Path))
                File.Delete(entry.Path);

            entry.Path = Path.Combine(_path, entry.GetPath());
            Directory.CreateDirectory(Path.GetDirectoryName(entry.Path));

            string content = JsonConvert.SerializeObject(entry, Formatting.Indented);
             File.WriteAllText(entry.Path, content);
            Console.WriteLine($"Entry #{entry.Id} was saved successfully in {entry.Path}");
        }

        public void RemoveEntry(Entry entry)
        {
            var id = entry.Id;
            
            if (!_allEntries.ContainsKey(id))
                throw new ApplicationException("Could not found entry with id " + id);

            var oldEntry = _allEntries[id];
            
            if (!String.IsNullOrEmpty(oldEntry.Path))
                File.Delete(oldEntry.Path);

            // Remove tag information related to this entry.
            oldEntry.Tags.ForEach(RemoveTag);
            _allEntries.Remove(id);
        }

        public void LoadData()
        {
            List<string> entryFileNames = GetEntryFiles().entryFiles;
            entryFileNames.Sort();

            _allEntries.Clear();
            _allTags.Clear();
            
            ParseEntries(entryFileNames);
            UpdateLinksToEntriesAll();
        }

        private (List<string> entryFiles, List<string> ignoredFiles) GetEntryFiles()
        {
            Console.WriteLine($"Browsing through path '{_path}'...");

            List<string> entryFiles = new List<string>();
            List<string> ignoredFiles = new List<string>();

            foreach (var jsonFilePath in Directory.GetFiles(_path, "*.json", SearchOption.AllDirectories))
            {
                string jsonFile = Path.GetFileName(jsonFilePath);

                if (_entryRegex.IsMatch(jsonFile))
                    entryFiles.Add(jsonFilePath);

                else
                    ignoredFiles.Add(jsonFilePath);
            }

            Console.WriteLine($"Browsing finished. Found {entryFiles.Count} entry candidates.");

            if (ignoredFiles.Count > 0)
            {
                Console.WriteLine("Ignored following files because their name didn't match expected pattern:");

                foreach (string file in ignoredFiles)
                    Console.WriteLine(file);
            }

            return (entryFiles, ignoredFiles);
        }

        private void AddTag(string tag)
        {
            if (!_allTags.ContainsKey(tag))
                _allTags.Add(tag, 1);
            else
                _allTags[tag]++;
        }

        private void RemoveTag(string tag)
        {
            if (_allTags.ContainsKey(tag))
            {
                if (_allTags[tag] > 1)
                    _allTags[tag]--;
                else
                    _allTags.Remove(tag);
            }
        }

        private void ParseEntries(List<string> entryFiles)
        {
            Dictionary<string, Exception> ignoredFiles = new Dictionary<string, Exception>();
            int entriesLoadedCount = 0;

            foreach (string entryFile in entryFiles)
            {
                try
                {
                    string rawJson = File.ReadAllText(entryFile);

                    JsonSerializerSettings jss = new JsonSerializerSettings {
                        Error = delegate(object sender,  Newtonsoft.Json.Serialization.ErrorEventArgs args) {
                            Console.WriteLine(args.ErrorContext.Error.Message);
                        }
                    };

                    Entry entry = JsonConvert.DeserializeObject<Entry>(rawJson, jss);
                    entry.Path = entryFile;

                    // Keep maximum ID number up to date
                    if (entry.Id > MaxId)
                        MaxId = entry.Id;

                    // Keep list of all tags updated
                    entry.Tags.ForEach(AddTag);

                    // Keep list of all entries updated
                    if (!_allEntries.ContainsKey(entry.Id))
                        _allEntries.Add(entry.Id, entry);

                    entriesLoadedCount++;

                    if (entriesLoadedCount % 100 == 0)
                        Console.WriteLine($"Loaded {entriesLoadedCount} entries...");
                }

                catch (Exception ex)
                {
                    ignoredFiles.Add(entryFile, ex);
                }
            }

            Console.WriteLine($"Loaded total of {entriesLoadedCount} entries.");

            if (ignoredFiles.Count > 0)
            {
                Console.WriteLine("Following files haven't been parsed because of exception:");

                foreach (var ignoredFile in ignoredFiles)
                    Console.WriteLine($"{ignoredFile.Key} - {ignoredFile.Value.Message}");
            }
        }

        private void UpdateLinksToEntries(Entry entry)
        {
            foreach (long linkedEntry in entry.LinksTo)
            {
                if (_allEntries.ContainsKey(linkedEntry))
                {
                    entry.LinksTo.Add(_allEntries[linkedEntry].Id);
                    entry.LinksTo.Sort();
                }

                else
                    throw new ApplicationException($"Entry #{entry.Id} links to entry #{linkedEntry}, which doesn't exist.");
            }
        }

        private void UpdateLinksToEntriesAll()
        {
            foreach (var entry in _allEntries.Values)
                UpdateLinksToEntries(entry);
        }
    }
}
