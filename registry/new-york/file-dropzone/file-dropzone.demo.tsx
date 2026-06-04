"use client"

import * as React from "react"

import { Label } from "@/registry/new-york/ui/label"
import {
  FileDropzone,
  FileDropzoneErrors,
  FileDropzoneList,
  FileDropzoneZone,
} from "@/registry/new-york/ui/file-dropzone"

export default function FileDropzoneDemo() {
  const [basic, setBasic] = React.useState<File[]>([])
  const [composed, setComposed] = React.useState<File[]>([])

  return (
    <div className="grid w-full max-w-md gap-8">
      <div className="grid gap-2">
        <Label>Images & PDFs · up to 5 MB</Label>
        <FileDropzone
          value={basic}
          onValueChange={setBasic}
          accept="image/*,.pdf"
          maxSize={5 * 1024 * 1024}
          multiple
        >
          <FileDropzoneZone />
          <FileDropzoneList />
          <FileDropzoneErrors />
        </FileDropzone>
      </div>

      <div className="grid gap-2">
        <Label>Data files · custom layout</Label>
        <FileDropzone
          value={composed}
          onValueChange={setComposed}
          accept=".csv,.json,.txt"
          maxSize={1 * 1024 * 1024}
          multiple
        >
          <FileDropzoneZone
            headline="Drop data files"
            subline="csv, json, txt · max 1 MB each"
          />
          <FileDropzoneErrors />
          <FileDropzoneList />
        </FileDropzone>
      </div>
    </div>
  )
}
