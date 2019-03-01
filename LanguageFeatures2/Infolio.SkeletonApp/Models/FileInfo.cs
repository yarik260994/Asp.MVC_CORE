namespace Infolio.SkeletonApp.Models
{
    public sealed class FileInfo
    {
        public FileInfo(string fileName, string fileType)
        {
            this.FileName = fileName;
            this.FileType = fileType;
        }

        public string FileName { get; set; }
        public string FileType { get; set; }
    }
}
