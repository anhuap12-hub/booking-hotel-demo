// src/theme/Theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#8B6F4E", // nâu cà phê (accent chính)
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#4A4A4A", // xám đậm
    },
    error: {
      main: "#9E2A2B", // đỏ trầm
    },
    warning: {
      main: "#C58940", // nâu vàng ấm
    },
    success: {
      main: "#4F6F52", // xanh olive trầm
    },
    info: {
      main: "#6B7280", // xám trung tính
    },
    text: {
    primary: "#1C1C1C",   // gần đen
    secondary: "#4D4D4D", // xám chữ phụ // xám chữ phụ // xám chữ phụ
    },
    background: {
      default: "#F5F3EF", // nền be xám rất nhẹ
      paper: "#FFFFFF",   // card
    },
    divider: "#E5E2DC",
  },

  typography: {
    fontFamily: "'Inter', sans-serif",

    h1: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.5px',
    },
  h2: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
  },
  h3: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 500,
  },
  h4: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 500,
  },
  h5: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 500,
  },

  body1: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 16,
    lineHeight: 1.6,
  },
  body2: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 15,
    lineHeight: 1.6,
  },
    button: {
      fontWeight: 500,
      letterSpacing: "0.02em",
    },
  },

  shape: {
    borderRadius: 12, // bo tròn mềm hơn Booking
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 10,
          paddingLeft: 20,
          paddingRight: 20,
        },
        outlined: {
          borderColor: "#8B6F4E",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "12px 14px",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: "#EFEAE3",
          color: "#4A4A4A",
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#E5E2DC",
        },
      },
    },
  },
});

export default theme;
