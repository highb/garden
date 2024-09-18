/*
 * Copyright (C) 2018-2024 Garden Technologies, Inc. <info@garden.io>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { expect } from "chai"
import { FileTree } from "../../../../src/vcs/file-tree.js"

async function emptyHash(): Promise<string> {
  return await Promise.resolve("")
}

describe("file-tree", () => {
  describe("on unix", () => {
    it("should get the files at a path", () => {
      const fileTree = FileTree.fromFiles(
        [
          { path: "/Users/developer/code/garden-project/project-1/frontend", hash: emptyHash },
          { path: "/Users/developer/code/garden-project/project-1/backend", hash: emptyHash },
          { path: "/Users/developer/code/garden-project/project-2/frontend", hash: emptyHash },
          { path: "/Users/developer/code/garden-project/project-2/backend", hash: emptyHash },
        ],
        "posix"
      )

      const filesAtProjectPath = fileTree.getFilesAtPath("/Users/developer/code/garden-project")

      expect(filesAtProjectPath).to.eql([
        { path: "/Users/developer/code/garden-project/project-1/frontend", hash: emptyHash },
        { path: "/Users/developer/code/garden-project/project-1/backend", hash: emptyHash },
        { path: "/Users/developer/code/garden-project/project-2/frontend", hash: emptyHash },
        { path: "/Users/developer/code/garden-project/project-2/backend", hash: emptyHash },
      ])

      const filesAtFirstProjectPath = fileTree.getFilesAtPath("/Users/developer/code/garden-project/project-1")

      expect(filesAtFirstProjectPath).to.eql([
        { path: "/Users/developer/code/garden-project/project-1/frontend", hash: emptyHash },
        { path: "/Users/developer/code/garden-project/project-1/backend", hash: emptyHash },
      ])
    })
  })

  describe("on windows", () => {
    it("should get the files at a path", () => {
      const fileTree = FileTree.fromFiles(
        [
          { path: "C:\\Users\\developer\\code\\garden-project\\project-1\\frontend", hash: emptyHash },
          { path: "C:\\Users\\developer\\code\\garden-project\\project-1\\backend", hash: emptyHash },
          { path: "C:\\Users\\developer\\code\\garden-project\\project-2\\frontend", hash: emptyHash },
          { path: "C:\\Users\\developer\\code\\garden-project\\project-2\\backend", hash: emptyHash },
        ],
        "win32"
      )

      const filesAtProjectPath = fileTree.getFilesAtPath("C:\\Users\\developer\\code\\garden-project")

      expect(filesAtProjectPath).to.eql([
        { path: "C:\\Users\\developer\\code\\garden-project\\project-1\\frontend", hash: emptyHash },
        { path: "C:\\Users\\developer\\code\\garden-project\\project-1\\backend", hash: emptyHash },
        { path: "C:\\Users\\developer\\code\\garden-project\\project-2\\frontend", hash: emptyHash },
        { path: "C:\\Users\\developer\\code\\garden-project\\project-2\\backend", hash: emptyHash },
      ])

      const filesAtFirstProjectPath = fileTree.getFilesAtPath("C:\\Users\\developer\\code\\garden-project\\project-1")

      expect(filesAtFirstProjectPath).to.eql([
        { path: "C:\\Users\\developer\\code\\garden-project\\project-1\\frontend", hash: emptyHash },
        { path: "C:\\Users\\developer\\code\\garden-project\\project-1\\backend", hash: emptyHash },
      ])
    })
  })
})
