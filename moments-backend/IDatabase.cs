using System.Collections.Generic;

using Moments.Models;

namespace Moments.Interfaces
{
    public interface IDatabase
    {
        List<Entry> Entries { get; }
        List<string> Tags { get; }
        Dictionary<string, int> TagsFrequencies { get; }
        Entry GetEntry(long id);
        void AddOrUpdateEntry(Entry entry);
        void RemoveEntry(Entry entry);
        void LoadData();
    }
}