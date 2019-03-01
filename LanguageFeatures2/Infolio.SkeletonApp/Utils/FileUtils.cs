using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Infolio.SkeletonApp.Utils
{
    class FileUtils
    {
        private static readonly string imgFile = "Изображение";
        private static readonly string printingFile = "Файл для печати";

        public static List<Models.FileInfo> GetAllFile(string directory, string extOfImages)
        {
            var extensionOfImages = extOfImages.Split(',');

            DirectoryInfo dirInfo = new DirectoryInfo($"{directory}");
            System.IO.FileInfo[] Files = dirInfo.GetFiles();
            List<Models.FileInfo> filesName = new List<Models.FileInfo>();

            foreach (System.IO.FileInfo file in Files)
            {
                string fileType;
                var fileExt = file.Name.Split('.').Last();

                if (extensionOfImages.Any(a => a == fileExt)) fileType = imgFile;
                else fileType = printingFile;

                filesName.Add(new Models.FileInfo(file.Name, fileType));
            }

            return filesName;
        }

        public static List<Models.FileInfo> GetAllImg(string directory, string extOfImages)
        {
           return GetAllFile(directory, extOfImages).Where(a=>a.FileType == imgFile).ToList();
        }

        public static List<Models.FileInfo> GetAllPrintFile(string directory, string extOfImages)
        {
            return GetAllFile(directory, extOfImages).Where(a => a.FileType == printingFile).ToList();
        }

    }
}
