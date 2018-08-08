using System;
using System.Collections.Generic;
using System.IO;
using System.Text.RegularExpressions;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Moments
{
    public class Database
    {
        private string path;
        private List<Entry> entries;

        private Regex entryRegex = new Regex("^[0-9]{8}-[0-9]{4}_[0-9]{6}[.]json$");

        public Database(string path)
        {
            if (path[path.Length - 1] != '/')
                path += '/';

            this.path = path;

            if (!Directory.Exists(path))
                throw new IOException($"Specified path {path} doesn't exist. Cannot load entries.");
        }

        public void SaveEntry(Entry entry)
        {
            // Method saves given entry. If Entry object doesn't have Path property assigned, new file
            // will be created. Otherwise existing path will be overwritten.
            throw new NotImplementedException();
        }

        public void LoadData()
        {
            List<string> entryFileNames = this.GetEntryFiles().entryFiles;
            entryFileNames.Sort();
            this.entries = this.ParseEntries(entryFileNames);
        }

        private (List<string> entryFiles, List<string> ignoredFiles) GetEntryFiles()
        {
            Console.WriteLine($"Browsing through path {this.path}...");

            List<string> entryFiles = new List<string>();
            List<string> ignoredFiles = new List<string>();

            foreach (var jsonFilePath in Directory.GetFiles(this.path, "*.json", SearchOption.AllDirectories))
            {
                string jsonFile = Path.GetFileName(jsonFilePath);

                if (entryRegex.IsMatch(jsonFile))
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

        private List<Entry> ParseEntries(List<string> entryFiles)
        {
            Dictionary<string, Exception> ignoredFiles = new Dictionary<string, Exception>();
            List<Entry> entries = new List<Entry>();
            List<string> tags = new List<string>();
            List<long> linksTo = new List<long>();
            List<int> timeComponents = new List<int>{ 1, 1, 1, 0, 0 };

            foreach (string entryFile in entryFiles)
            {
                try
                {
                    string rawJson = File.ReadAllText(entryFile);
                    dynamic dynamicEntry = JObject.Parse(rawJson);

                    long id = dynamicEntry.id;
                    string author = dynamicEntry.author;
                    string text = dynamicEntry.text;
                    bool privateEntry = dynamicEntry["private"];

                    foreach (var tag in dynamicEntry.tags)
                        tags.Add(tag.Value);

                    foreach (var link in dynamicEntry.links_to)
                        linksTo.Add(link.Value);

                    for (int i = 0; i < 5; i++)
                    {
                        string component = dynamicEntry.time_components[i];

                        if (component.Length > 0)
                            timeComponents[i] = Int32.Parse(component);
                        else
                            timeComponents[i] = 0;
                    }

                    Entry e = new Entry(
                        id,
                        author,
                        text,
                        privateEntry,
                        tags,
                        linksTo,
                        timeComponents
                    );

                    entries.Add(e);
                }
                catch (Exception ex)
                {
                    ignoredFiles.Add(entryFile, ex);
                }
            }

            if (ignoredFiles.Count > 0)
            {
                Console.WriteLine("Following files haven't been parsed because of exception:");

                foreach (var ignoredFile in ignoredFiles)
                {
                    Console.WriteLine($"{ignoredFile.Key} - {ignoredFile.Value.Message}");
                }
            }
            return entries;
        }
    }
}