/*
 * Copyright (C) 2018-2024 Garden Technologies, Inc. <info@garden.io>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { expect } from "chai"
import { FileTree } from "../../../../src/vcs/file-tree.js"
import { VcsFile } from "../../../../src/vcs/vcs.js"

async function emptyHash(): Promise<string> {
  return await Promise.resolve("")
}

describe("file-tree", () => {
  describe("on unix", () => {
    it("should get the files at a path", () => {
      const fileTree = FileTree.fromFiles(
        [
          new VcsFile("/Users/developer/code/garden-project/project-1/frontend", emptyHash),
          new VcsFile("/Users/developer/code/garden-project/project-1/backend", emptyHash),
          new VcsFile("/Users/developer/code/garden-project/project-2/frontend", emptyHash),
          new VcsFile("/Users/developer/code/garden-project/project-2/backend", emptyHash),
        ],
        "posix"
      )

      const filesAtProjectPath = fileTree.getFilesAtPath("/Users/developer/code/garden-project")

      const expectedFilesAtProjectPath: VcsFile[] = [
        new VcsFile("/Users/developer/code/garden-project/project-1/frontend", emptyHash),
        new VcsFile("/Users/developer/code/garden-project/project-1/backend", emptyHash),
        new VcsFile("/Users/developer/code/garden-project/project-2/frontend", emptyHash),
        new VcsFile("/Users/developer/code/garden-project/project-2/backend", emptyHash),
      ]
      expect(filesAtProjectPath).to.eql(expectedFilesAtProjectPath)

      const filesAtFirstProjectPath = fileTree.getFilesAtPath("/Users/developer/code/garden-project/project-1")

      const expectedFilesAtFirstProjectPath: VcsFile[] = [
        new VcsFile("/Users/developer/code/garden-project/project-1/frontend", emptyHash),
        new VcsFile("/Users/developer/code/garden-project/project-1/backend", emptyHash),
      ]
      expect(filesAtFirstProjectPath).to.eql(expectedFilesAtFirstProjectPath)
    })
  })

  describe("on windows", () => {
    it("should get the files at a path", () => {
      const fileTree = FileTree.fromFiles(
        [
          new VcsFile("C:\\Users\\developer\\code\\garden-project\\project-1\\frontend", emptyHash),
          new VcsFile("C:\\Users\\developer\\code\\garden-project\\project-1\\backend", emptyHash),
          new VcsFile("C:\\Users\\developer\\code\\garden-project\\project-2\\frontend", emptyHash),
          new VcsFile("C:\\Users\\developer\\code\\garden-project\\project-2\\backend", emptyHash),
        ],
        "win32"
      )

      const filesAtProjectPath = fileTree.getFilesAtPath("C:\\Users\\developer\\code\\garden-project")

      const expectedFilesAtProjectPath: VcsFile[] = [
        new VcsFile("C:\\Users\\developer\\code\\garden-project\\project-1\\frontend", emptyHash),
        new VcsFile("C:\\Users\\developer\\code\\garden-project\\project-1\\backend", emptyHash),
        new VcsFile("C:\\Users\\developer\\code\\garden-project\\project-2\\frontend", emptyHash),
        new VcsFile("C:\\Users\\developer\\code\\garden-project\\project-2\\backend", emptyHash),
      ]
      expect(filesAtProjectPath).to.eql(expectedFilesAtProjectPath)

      const filesAtFirstProjectPath = fileTree.getFilesAtPath("C:\\Users\\developer\\code\\garden-project\\project-1")

      const expectedFilesAreFirstProjectPath: VcsFile[] = [
        new VcsFile("C:\\Users\\developer\\code\\garden-project\\project-1\\frontend", emptyHash),
        new VcsFile("C:\\Users\\developer\\code\\garden-project\\project-1\\backend", emptyHash),
      ]
      expect(filesAtFirstProjectPath).to.eql(expectedFilesAreFirstProjectPath)
    })
  })
})
