using Infolio.Core.Internal.Data;
using Ninject;
using System.Threading;
using System.Threading.Tasks;

namespace Infolio.SkeletonApp
{
    /// <summary>
    /// Сервис приложения
    /// </summary>
    public class SkeletonAppliсationService
    {
        /// <summary>
        /// Конфигурация сервиса приложения. Тут прокидываем <see cref="InfolioApplicationData"/> и настраиваем джобы
        /// </summary>
        /// <param name="kernel">Kernel</param>
        /// <param name="applicationData">Данные Infolio</param>
        /// <returns>Task</returns>
        public Task Configure(IKernel kernel, InfolioApplicationData applicationData)
        {
            return Task.FromResult(0);
        }

        /// <summary>
        /// Выполняем логику
        /// </summary>
        public Task<bool> Process()
        {
            Thread.Sleep(1000);
            return Task.FromResult(true);
        }
    }
}