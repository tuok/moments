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
        Entry AddEntry(Entry entry);
        Entry SaveEntry(Entry entry);
        void LoadData();
    }
}