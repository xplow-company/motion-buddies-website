"use client";

import { useEffect } from "react";
import { initSite } from "@/motion";

export function Motion() {
  useEffect(() => initSite(), []);
  return null;
}
