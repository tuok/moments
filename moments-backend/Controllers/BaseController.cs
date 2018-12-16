using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Newtonsoft.Json;

using Moments;
using Moments.Models;
using Moments.Interfaces;

namespace Moments.Controllers
{
    public class BaseController : Controller
    {
        public IDatabase Database { get; protected set; }

        public BaseController(IDatabase database) {
            this.Database = database;
        }
    }
}
