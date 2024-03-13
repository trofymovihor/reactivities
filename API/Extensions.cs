using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API
{
    public static class GeneralExtensions
    {
        public static bool IsDevBMFI(this IHostEnvironment env) => env.EnvironmentName == "Development_BMFI";
    }
}