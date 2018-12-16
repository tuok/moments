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
            if (args.Length < 5 || !checkArgs(args))
            {
                Console.WriteLine("Following arguments have to be provided:");
                Console.WriteLine("    entryPath=<root path to entries>");
                Console.WriteLine("    username=<username for frontend requests>");
                Console.WriteLine("    password=<password for frontend requests>");
                Console.WriteLine("    certificate=<SSL certificate file path>");
                Console.WriteLine("    certificatePassword=<SSL certificate password>");
                return;
            }

            BuildWebHost(args).Run();
        }

        private static bool checkArgs(string[] args)
        {
            var mandatoryArgs = new string[] { "entryPath", "username", "password", "certificate", "certificatePassword" };
            return args.All(arg => mandatoryArgs.Any(mArg => arg.Contains(mArg)));
        }

        public static IWebHost BuildWebHost(string[] args)
        {
            string certKey = "certificate=";
            string certPassKey = "certificatePassword=";

            string certFile = null;
            string certPass = null;

            foreach (var arg in args)
            {
                if (arg.Contains(certKey))
                    certFile = arg.Split(certKey)[1];

                else if (arg.Contains(certPassKey))
                    certPass = arg.Split(certPassKey)[1];
            }

            if (certFile == null || certPass == null)
                throw new ArgumentException("Did not receive certificate file and/or certificate password!");

            var cert = new X509Certificate2(certFile, certPass);
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
