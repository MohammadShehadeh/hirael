"use client"

import * as React from "react"

import { Label } from "@/registry/sabk/ui/label"
import {
  FileDropzone,
  FileDropzoneErrors,
  FileDropzoneList,
  FileDropzoneRoot,
  FileDropzoneZone,
} from "@/registry/sabk/file-dropzone/file-dropzone"

export default function FileDropzoneDemo() {
  const [single, setSingle] = React.useState<File[]>([])
  const [compound, setCompound] = React.useState<File[]>([])

  return (
    <div className="grid w-full max-w-md gap-8">
      <div className="grid gap-2">
        <Label>Single-prop API · images & PDFs, up to 5 MB</Label>
        <FileDropzone
          value={single}
          onValueChange={setSingle}
          accept="image/*,.pdf"
          maxSize={5 * 1024 * 1024}
          multiple
        />
      </div>

      <div className="grid gap-2">
        <Label>Compound API · custom layout</Label>
        <FileDropzoneRoot
          value={compound}
          onValueChange={setCompound}
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
        </FileDropzoneRoot>
      </div>
    </div>
  )
}
