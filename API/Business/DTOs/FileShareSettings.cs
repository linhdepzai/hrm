using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.DTOs
{
    public class FileShareSettings
    {
        public string FileShareName { get; set; } = string.Empty;
        public string ConnectionStrings { get; set; } = string.Empty;
    }
}
