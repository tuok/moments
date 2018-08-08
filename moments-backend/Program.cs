using System;

namespace Moments
{
    class Program
    {
        static void Main(string[] args)
        {
            if (args.Length < 1)
            {
                throw new ArgumentException("No path argument given, cannot load entries.");
            }

            var sourcePath = args[0];

            Console.WriteLine($"Using '{sourcePath}' as a source path for entries...");

            Moments.Database db = new Moments.Database(sourcePath);
            db.LoadData();
        }
    }
}
