using System;

namespace Moments
{
    public static class Utils
    {
        public static bool Authenticate(string userKey, string apiKey, out string error)
        {
            if (userKey != apiKey)
            {
                error = "{ \"error\": \"not authenticated\" }";
                return false;
            }

            error = null;
            return true;
        }
    }
    public static class StringExtensions
    {
        public static bool ContainsIgnoreCase(this string source, string toCheck)
        {
            return source?.IndexOf(toCheck, StringComparison.OrdinalIgnoreCase) >= 0;
        }
    }
}