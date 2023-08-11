#!/usr/bin/env python3

import json
import struct
import sys
from pathlib import Path
from subprocess import Popen, run

# Read a message from stdin and decode it.
def get_message():
    raw_length = sys.stdin.buffer.read(4)

    if not raw_length:
        sys.exit(0)
    message_length = struct.unpack("=I", raw_length)[0]
    message = sys.stdin.buffer.read(message_length).decode("utf-8")
    return json.loads(message)

# Encode a message for transmission, given its content.
def encode_message(message_content):
    encoded_content = json.dumps(message_content).encode("utf-8")
    encoded_length = struct.pack("=I", len(encoded_content))
    return {
        "length": encoded_length,
        "content": struct.pack(str(len(encoded_content)) + "s", encoded_content),
    }

# Send an encoded message to stdout.
def send_message(encoded_message):
    sys.stdout.buffer.write(encoded_message["length"])
    sys.stdout.buffer.write(encoded_message["content"])
    sys.stdout.buffer.flush()

DOWNLOADS = Path.home() / "Downloads"

message = get_message()

action = message["action"]
if action == "test":
    reply = {"success": True}
elif action == "download":
    url = message["url"]
    p = run(
        ["yt-dlp.exe", "--print-json", "--", url],  # Use yt-dlp.exe on Windows
        capture_output=True,
        text=True,
        cwd=DOWNLOADS,
    )
    if p.returncode == 0:
        output = json.loads(p.stdout)
        reply = {
            "success": True,
            "path": str(DOWNLOADS / output["_filename"]),
            "title": output["title"],
            "thumbnail": output["thumbnail"],
        }
    else:
        reply = {
            "success": False,
            "error": p.stderr,
        }
elif action == "open":
    path = message["path"]
    Popen(["start", "", path], shell=True)  # Use 'start' command to open file with default program
    reply = {"success": True}
elif action == "show":
    path = message["path"]
    Popen(["explorer", "/select,", path], shell=True)  # Use 'explorer' to open file location in Windows Explorer
    reply = {"success": True}
else:
    print(f"Got unknown action: {message}", file=sys.stderr)
    reply = {"success": False, "error": f"Unknown action: {action}"}

send_message(encode_message(reply))
