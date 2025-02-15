const GDX2_HOST_BACKEND = "r48-vws03.zsniigg.local:8001"
const GDX2_HOST_MAP = "r48-vws03.zsniigg.local:7800"

// /process.env.GDX2_HOST_BACKEND || 
const gdx2_backend =  GDX2_HOST_BACKEND
const gdx2_map = GDX2_HOST_MAP
const gdx2_map_db = "gdx2"
const gdx2_api_version = `api/v1`

export const gdx2_cfg = {
  // delay:60,
  gdx2_backend      : `${gdx2_backend}`,
  gdx2_backend_url  : `http://${gdx2_backend}/${gdx2_api_version}`,

  gdx2_map          : `${gdx2_map}`,
  gdx2_map_db       : `${gdx2_map_db}`,
  gdx2_map_url      : `http://${gdx2_map}/${gdx2_map_db}.`,
  
}
