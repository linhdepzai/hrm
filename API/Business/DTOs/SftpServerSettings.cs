using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.DTOs
{
    public class SftpServerSettings
    {
        public string Localhost { get; set; } = string.Empty;
        public int Port { get; set; } = 2222;
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
