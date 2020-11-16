using System;
using System.Net;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace Moments
{
    public class Program
    {
        public static void Main(string[] args)
        {
            if (args.Length < 1)
            {
                Console.WriteLine("Following arguments have to be provided:");
                Console.WriteLine("    entryPath=<root path to entries>");
                return;
            }

            BuildWebHost(args).Run();
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