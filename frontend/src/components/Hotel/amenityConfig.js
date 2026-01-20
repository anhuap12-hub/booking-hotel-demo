import WifiIcon from "@mui/icons-material/Wifi";
import PoolIcon from "@mui/icons-material/Pool";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SpaIcon from "@mui/icons-material/Spa";
import PetsIcon from "@mui/icons-material/Pets";

export const AMENITY_MAP = {
  wifi: { label: "Wi-Fi miễn phí", Icon: WifiIcon },
  pool: { label: "Hồ bơi", Icon: PoolIcon },
  parking: { label: "Bãi đỗ xe", Icon: LocalParkingIcon },
  air_conditioning: { label: "Điều hòa", Icon: AcUnitIcon },
  restaurant: { label: "Nhà hàng", Icon: RestaurantIcon },
  gym: { label: "Phòng gym", Icon: FitnessCenterIcon },
  spa: { label: "Spa", Icon: SpaIcon },
  pets: { label: "Cho phép thú cưng", Icon: PetsIcon },
};
