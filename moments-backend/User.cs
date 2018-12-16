using System;
using System.Collections.Generic;

using Newtonsoft.Json;

namespace Moments.Models
{
    public class User
    {
        [JsonProperty("username")]
        public string Username { get; set; }
        [JsonProperty("password")]
        public string Password { get; set; }
    }
}