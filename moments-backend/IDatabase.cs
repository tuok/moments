using System;
using System.Collections.Generic;
using System.IO;
using System.Text.RegularExpressions;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using Moments.Models;

namespace Moments.Interfaces
{
    public interface IDatabase
    {
        List<Entry> Entries { get; }
        List<string> Tags { get; }
        Dictionary<string, int> TagsFrequencies { get; }
        Entry GetEntry(long id);
        void AddEntry(Entry entry);
        void SaveEntry(Entry entry);
        void LoadData();
    }
}