using System;
using System.Linq;
using System.Net;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace Moments
{
    public class Program
    {
        public static void Main(string[] args)
        {
            if (args.Length < 3 || !CheckArgs(args))
            {
                Console.WriteLine("Following arguments have to be provided:");
                Console.WriteLine("    entryPath=<root path to entries>");
                Console.WriteLine("    username=<username for frontend requests>");
                Console.WriteLine("    password=<password for frontend requests>");
                return;
            }

            BuildWebHost(args).Run();
        }

        private static bool CheckArgs(string[] args)
        {
            var mandatoryArgs = new[] { "entryPath", "username", "password" };
            return args.All(arg => mandatoryArgs.Any(arg.Contains));
        }

        public static IWebHost BuildWebHost(string[] args)
        {
            return WebHost.CreateDefaultBuilder(args)
                .UseKestrel(options => {
                    options.Listen(IPAddress.Parse("0.0.0.0"), 5000);
                })
                .UseStartup<Startup>()
                .Build();
        }
    }
}