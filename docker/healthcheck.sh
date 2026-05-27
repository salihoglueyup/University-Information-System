#!/bin/sh
# ==========================================
# UBIS Server — Container Health Check
# ==========================================
# Called by Docker HEALTHCHECK instruction.
# Exits 0 (healthy) when the Express server responds on GET /

wget --no-verbose --tries=1 --spider "http://localhost:${PORT:-5000}/" || exit 1
