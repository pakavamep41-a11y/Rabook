import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, CartItem } from "../types";
import { setGlobalPersianDigits } from "./persian";

interface Alert {
  message: string;
  type: "success" | "error" | "info";
}

interface AppState {
  // Auth
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  impersonatedUser: User | null;
  startImpersonation: (user: User) => void;
  stopImpersonation: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "id" | "totalPrice">) => void;
  removeFromCart: (id: string) => void;
  updateCartItemQuantity: (id: string, quantity: number) => void;
  updateCartItemNote: (id: string, note: string) => void;
  clearCart: () => void;

  tempDesign: { id: string, image: string, json: string } | null;
  setTempDesign: (design: { id: string, image: string, json: string } | null) => void;

  // UI / Localization
  usePersianDigits: boolean;
  togglePersianDigits: () => void;
  setUsePersianDigits: (val: boolean) => void;
  alert: Alert | null;
  showAlert: (message: string, type?: "success" | "error" | "info") => void;
  hideAlert: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => {
      // Initialize digits setting
      const storedDigits = localStorage.getItem("w2p_digits");
      const initialDigitsSetting = storedDigits ? storedDigits === "true" : true;
      setGlobalPersianDigits(initialDigitsSetting);

      return {
        // Auth
        user: null,
        token: null,
        impersonatedUser: null,
        login: (user, token) => {
          set({ user, token });
        },
        logout: () => {
          set({ user: null, token: null, impersonatedUser: null, cart: [] });
        },
        startImpersonation: (user) => {
          set({ impersonatedUser: user, cart: [] });
          get().showAlert(`وارد حساب کاربری ${user.name} شدید.`, "success");
        },
        stopImpersonation: () => {
          set({ impersonatedUser: null, cart: [] });
          get().showAlert("بازگشت به حساب مدیریت.", "info");
        },

        // Cart
        cart: [],
        addToCart: (item) => {
          const currentCart = get().cart;
          // Generate unique key based on productId and selected options
          const optionSignature = JSON.stringify(item.options);
          
          const existingIndex = currentCart.findIndex(
            (c) => c.productId === item.productId && JSON.stringify(c.options) === optionSignature
          );

          if (existingIndex > -1) {
            // Update quantity and price on existing
            const updatedCart = [...currentCart];
            const updatedItem = updatedCart[existingIndex];
            const newQty = updatedItem.quantity + item.quantity;
            updatedCart[existingIndex] = {
              ...updatedItem,
              quantity: newQty,
              totalPrice: newQty * updatedItem.unitPrice,
            };
            set({ cart: updatedCart });
          } else {
            // Create new item
            const id = `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const newItem: CartItem = {
              ...item,
              id,
              totalPrice: item.quantity * item.unitPrice,
            };
            set({ cart: [...currentCart, newItem] });
          }
          get().showAlert("محصول با موفقیت به سبد خرید اضافه شد.", "success");
        },
        removeFromCart: (id) => {
          const filtered = get().cart.filter((c) => c.id !== id);
          set({ cart: filtered });
          get().showAlert("محصول از سبد خرید حذف شد.", "info");
        },
        updateCartItemQuantity: (id, quantity) => {
          if (quantity <= 0) {
            get().removeFromCart(id);
            return;
          }
          const updated = get().cart.map((c) => {
            if (c.id === id) {
              return {
                ...c,
                quantity,
                totalPrice: quantity * c.unitPrice,
              };
            }
            return c;
          });
          set({ cart: updated });
        },
        updateCartItemNote: (id, note) => {
          const updated = get().cart.map((c) => c.id === id ? { ...c, note } : c);
          set({ cart: updated });
        },
        clearCart: () => {
          set({ cart: [] });
        },

        tempDesign: null,
        setTempDesign: (design) => set({ tempDesign: design }),

        // UI & Locales
        usePersianDigits: initialDigitsSetting,
        togglePersianDigits: () => {
          const nextSetting = !get().usePersianDigits;
          localStorage.setItem("w2p_digits", String(nextSetting));
          setGlobalPersianDigits(nextSetting);
          set({ usePersianDigits: nextSetting });
        },
        setUsePersianDigits: (val) => {
          localStorage.setItem("w2p_digits", String(val));
          setGlobalPersianDigits(val);
          set({ usePersianDigits: val });
        },
        alert: null,
        showAlert: (message, type = "info") => {
          set({ alert: { message, type } });
          // Auto dismiss
          setTimeout(() => {
            const currentAlert = get().alert;
            if (currentAlert && currentAlert.message === message) {
              set({ alert: null });
            }
          }, 5000);
        },
        hideAlert: () => {
          set({ alert: null });
        },
      };
    },
    {
      name: "w2p-storage", // name of the item in the storage (must be unique)
      partialize: (state) => ({ cart: state.cart, user: state.user, token: state.token }), // persist specific parts
    }
  )
);
