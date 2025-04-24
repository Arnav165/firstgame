#!/bin/bash
uvicorn game:app --host 0.0.0.0 --port $PORT
