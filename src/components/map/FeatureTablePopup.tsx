  
export function tableFeature(features: maplibregl.MapGeoJSONFeature[] | undefined) {
  const tableHTML = `
    <html>
            <style>
            .maplibregl-popup {
              max-width: 400px !important;
            }

            .maplibregl-popup-content {
              background-color: #1e293b;
              color: #f8fafc;
              border-radius: 8px;
              padding: 6px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }

            .maplibregl-popup-content h1 {
              font-size: 1rem;
              margin-bottom: 12px;
              color: #f8fafc;
            }

            .maplibregl-popup-content table {
              width: 100%;
              border-collapse: collapse;
            }

            .maplibregl-popup-content th,
            .maplibregl-popup-content td {
              border: 1px solid #374151;
              padding: 4px;
              text-align: left;
            }

            .maplibregl-popup-content th {
              background-color: #1e40af;
              color: #f8fafc;
            }

            .maplibregl-popup-content td {
              background-color: #1e293b;
              color: #f8fafc;
            }
          </style>

    <body>
            
    <h1>Отчетов: ${features?.length}</h1>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th class="border border-gray-300 p-2 dark:bg-slate-800 dark:text-slate-200">Параметр</th>
          <th class="border border-gray-300 p-2 dark:bg-slate-800 dark:text-slate-200">Значение</th>
          
        </tr>
      </thead>
      <tbody>
        ${features?.map((feature) => `
              <tr>
                <td class="border border-gray-300 p-2 dark:bg-slate-800 dark:text-slate-200">Автор</td>
                <td class="border border-gray-300 p-2 dark:bg-slate-800 dark:text-slate-200">${feature.properties.avts}</td>
              </tr>
              <tr>
                <td class="border border-gray-300 p-2 dark:bg-slate-800 dark:text-slate-200">Отчет</td>
                <td class="border border-gray-300 p-2 dark:bg-slate-800 dark:text-slate-200">${feature.properties.name_otch}</td>
              </tr>
              <tr>
                <td class="border border-gray-300 p-2 dark:bg-slate-800 dark:text-slate-200">Организация</td>
                <td class="border border-gray-300 p-2 dark:bg-slate-800 dark:text-slate-200">${feature.properties.org_isp}</td>
              </tr>
              <tr>
                <td class="border border-gray-300 p-2 dark:bg-slate-800 dark:text-slate-200">Год начала</td>
                <td class="border border-gray-300 p-2 dark:bg-slate-800 dark:text-slate-200">${feature.properties.god_nach}</td>
              </tr>
              <tr>
                <td class="border border-gray-300 p-2 dark:bg-slate-800 dark:text-slate-200">Год окончания</td>
                <td class="border border-gray-300 p-2 dark:bg-slate-800 dark:text-slate-200">${feature.properties.god_end}</td>
              </tr>
              <tr>
                <td class="border border-gray-300 p-2 dark:bg-slate-800 dark:text-slate-200">Метод</td>
                <td class="border border-gray-300 p-2 dark:bg-slate-800 dark:text-slate-200">${feature.properties.method}</td>
              </tr>
              <tr>
                <td class="border border-gray-300 p-2 dark:bg-slate-800 dark:text-slate-200">Лист</td>
                <td class="border border-gray-300 p-2 dark:bg-slate-800 dark:text-slate-200">${feature.properties.nom_1000}</td>
              </tr>
              <tr>
                <td class="border border-gray-300 p-2 dark:bg-slate-800 dark:text-slate-200">Масштаб</td>
                <td class="border border-gray-300 p-2 dark:bg-slate-800 dark:text-slate-200">${feature.properties.scale}</td>
              </tr>
              <tr>
                <td class="border border-gray-300 p-2 dark:bg-slate-800 dark:text-slate-200">ТГФ</td>
                <td class="border border-gray-300 p-2 dark:bg-slate-800 dark:text-slate-200">${feature.properties.tgf}</td>
              </tr>
              <tr>
                <td class="border border-gray-300 p-2 dark:bg-slate-800 dark:text-slate-200">Вид</td>
                <td class="border border-gray-300 p-2 dark:bg-slate-800 dark:text-slate-200">${feature.properties.vid_iz}</td>
              </tr>
              <tr>
                <td class="border border-gray-300 p-2 dark:bg-slate-800 dark:text-slate-200">№</td>
                <td class="border border-gray-300 p-2 dark:bg-slate-800 dark:text-slate-200">${feature.properties.web_uk_id}</td>
              </tr>
            `
          )
          .join('')}
          </tbody>
        </table>
      </body>
    </html>

  `;
  
  return( tableHTML ) 
}
