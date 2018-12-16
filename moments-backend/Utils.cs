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
}