import { gdx2_cfg } from "./cfg"

const {gdx2_backend_url} = gdx2_cfg


export const gdx2_urls = {
  // delay:60,
  gdx2_url_report_count           : `${gdx2_backend_url}/report/count`,
  gdx2_url_report_author_count    : `${gdx2_backend_url}/report/author/count`,
  gdx2_url_report_list_count      : `${gdx2_backend_url}/report/list/count`,
  gdx2_url_report_subrf_count     : `${gdx2_backend_url}/report/subrf/count`,
  gdx2_url_report_org_count       : `${gdx2_backend_url}/report/org/count`,
  gdx2_url_report_area_count      : `${gdx2_backend_url}/report/area/count`,
  gdx2_url_report_field_count     : `${gdx2_backend_url}/report/field/count`,
  gdx2_url_report_lu_count        : `${gdx2_backend_url}/report/lu/count`,
  gdx2_url_report_pi_count        : `${gdx2_backend_url}/report/pi/count`,
  gdx2_url_report_vid_rab_count   : `${gdx2_backend_url}/report/vid_rab/count`,
  
  gdx2_url_report_search          : `${gdx2_backend_url}/report/query?q=`,
  
  gdx2_url_report_all             : `${gdx2_backend_url}/report/all`,
  gdx2_url_report_author          : `${gdx2_backend_url}/report/author`,
  gdx2_url_report_list            : `${gdx2_backend_url}/report/list`,
  gdx2_url_report_subrf           : `${gdx2_backend_url}/report/subrf`,
  gdx2_url_report_org             : `${gdx2_backend_url}/report/org`,
  gdx2_url_report_area            : `${gdx2_backend_url}/report/area`,
  gdx2_url_report_field           : `${gdx2_backend_url}/report/field`,
  gdx2_url_report_lu              : `${gdx2_backend_url}/report/lu`,
  gdx2_url_report_pi              : `${gdx2_backend_url}/report/pi`,
  gdx2_url_report_vid_rab         : `${gdx2_backend_url}/report/vid_rab`,
  gdx2_url_message                : `${gdx2_backend_url}/report/message`,

  gdx2_url_sta            : `${gdx2_backend_url}/sta/rosg/count`,
  gdx2_url_stl            : `${gdx2_backend_url}/stl/rosg/count`,
  gdx2_url_stp            : `${gdx2_backend_url}/stp/rosg/count`,
  gdx2_url_stall_method     : `${gdx2_backend_url}/stall/all/method/unique`,
  
  


}
