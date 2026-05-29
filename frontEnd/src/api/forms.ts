import apiClient from "./client";
import type { MembershipCard, MembershipPayload } from "@/types";

export const contactApi = {
  send: async (payload: { name: string; email: string; subject: string; message: string }) => {
    try {
      await apiClient.post("/contact", payload);
    } catch {
      /* le backend peut ne pas exposer /contact — fallback silencieux */
    }
  },
};

export const membershipApi = {
  apply: async (payload: MembershipPayload): Promise<MembershipCard> => {
    try {
      const form = new FormData();
      (Object.keys(payload) as (keyof MembershipPayload)[]).forEach((k) => {
        const v = payload[k];
        if (v != null && k !== "photo") form.append(k, String(v));
      });
      if (payload.photo) form.append("photo", payload.photo);
      const { data } = await apiClient.post<{ card: MembershipCard }>("membership/apply", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.card;
    } catch (error: any) {
      // Fallback si le backend n'a pas encore l'endpoint
      if (error?.response?.status === 404) {
        // Retourner une carte mock pour tester le frontend
        return {
          id: `temp-${Date.now()}`,
          memberNumber: `ACEEMUB -${Math.floor(1000 + Math.random() * 9000)}`,
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          phone: payload.phone,
          school: payload.school,
          level: payload.level,
          city: payload.city,
          photoDataUrl: null,
          qrCode: "",
          isActive: true,
          createdAt: new Date().toISOString(),
        };
      }
      throw error;
    }
  },
  getCard: async (id: string) => {
    try {
      const { data } = await apiClient.get<{ card: MembershipCard }>(`membership/${id}`);
      return data.card;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        // Retourner une carte mock
        return {
          id,
          memberNumber: "AEEMUB-0001",
          firstName: "Membre",
          lastName: "ACEEMUB ",
          email: "membre@ACEEMUB .org",
          phone: "+229 00 00 00 00",
          school: "Université d'Abomey-Calavi",
          level: "Licence 2",
          city: "Cotonou",
          photoDataUrl: null,
          qrCode: "",
          isActive: true,
          createdAt: new Date().toISOString(),
        };
      }
      throw error;
    }
  },
};
