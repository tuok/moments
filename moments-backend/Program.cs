using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Moments
{
    public class Program
    {
        public static void Main(string[] args)
        {
            if (args.Length < 1)
            {
                Console.WriteLine("Path to entries root folder has to be given as an argument.");
                return;
            }

            Console.WriteLine($"Entry root path '{args[0]}' was provided.");
            args[0] = "entryPath=" + args[0];

            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args)
        {
            var cert = new X509Certificate2("cert.pfx", "");
            var ip = IPAddress.Parse("0.0.0.0");

            return WebHost.CreateDefaultBuilder(args)
                .UseKestrel(options =>
                {
                    options.Listen(ip, 5000);
                    options.Listen(ip, 5001, listenoptions =>
                    {
                        listenoptions.UseHttps(cert);
                    });
                })
                .UseStartup<Startup>()
                .Build();
        }
    }
}
