/*
 * Copyright (C) 2018-2023 Garden Technologies, Inc. <info@garden.io>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { expect } from "chai"
import { makeDummyGarden } from "../../../../src/garden"
import { joi } from "../../../../src/config/common"
import type { Log } from "../../../../src/logger/log-entry"
import { getRootLogger, Logger } from "../../../../src/logger/logger"
import { sanitizeValue } from "../../../../src/util/logging"
import { projectRootA } from "../../../helpers"

describe("sanitizeValue", () => {
  const logger: Logger = getRootLogger()

  it("replaces Buffer instances", () => {
    const obj = {
      a: Buffer.from([0, 1, 2, 3]),
    }
    const res = sanitizeValue(obj)
    expect(res).to.eql({
      a: "<Buffer>",
    })
  })

  it("replaces nested values", () => {
    const obj = {
      a: {
        b: Buffer.from([0, 1, 2, 3]),
      },
    }
    const res = sanitizeValue(obj)
    expect(res).to.eql({
      a: { b: "<Buffer>" },
    })
  })

  it("replaces attributes on a class instance", () => {
    class Foo {
      b: Buffer

      constructor() {
        this.b = Buffer.from([0, 1, 2, 3])
      }
    }
    const obj = {
      a: new Foo(),
    }
    const res = sanitizeValue(obj)
    expect(res).to.eql({
      a: { b: "<Buffer>" },
    })
  })

  it("replaces nested values on class attributes", () => {
    class Foo {
      b: any

      constructor() {
        this.b = { c: Buffer.from([0, 1, 2, 3]) }
      }
    }
    const obj = {
      a: new Foo(),
    }
    const res = sanitizeValue(obj)
    expect(res).to.eql({
      a: { b: { c: "<Buffer>" } },
    })
  })

  it("replaces nested values in an array", () => {
    const obj = {
      a: {
        b: [Buffer.from([0, 1, 2, 3])],
      },
    }
    const res = sanitizeValue(obj)
    expect(res).to.eql({
      a: { b: ["<Buffer>"] },
    })
  })

  it("replaces nested values in an object in an array", () => {
    const obj = {
      a: [
        {
          b: [Buffer.from([0, 1, 2, 3])],
        },
      ],
    }
    const res = sanitizeValue(obj)
    expect(res).to.eql({
      a: [{ b: ["<Buffer>"] }],
    })
  })

  it("replaces a circular reference", () => {
    const a = { b: <any>{} }
    a.b.a = a
    const res = sanitizeValue(a)
    expect(res).to.eql({ b: { a: "[Circular]" } })
  })

  it("replaces a circular reference nested in an array", () => {
    const a = [{ b: <any>{} }]
    a[0].b.a = a
    const res = sanitizeValue(a)
    expect(res).to.eql([{ b: { a: "[Circular]" } }])
  })

  it("replaces a circular reference nested under a class attribute", () => {
    class Foo {
      a: any
    }

    const a = [{ b: new Foo() }]
    a[0].b.a = a
    const res = sanitizeValue(a)
    expect(res).to.eql([{ b: { a: "[Circular]" } }])
  })

  it("replaces Garden instances", async () => {
    const obj = {
      a: await makeDummyGarden(projectRootA, { commandInfo: { name: "foo", args: {}, opts: {} } }),
    }
    const res = sanitizeValue(obj)
    expect(res).to.eql({
      a: "<Garden>",
    })
  })

  it("replaces LogEntry instances", async () => {
    const log = logger.createLog().info("foo")
    const obj = {
      a: log,
    }
    const res = sanitizeValue(obj)
    expect(res).to.eql({
      a: "<Log>",
    })
  })

  it("calls sanitize method if present", async () => {
    class Foo {
      toSanitizedValue() {
        return "foo"
      }
    }
    const obj = {
      a: new Foo(),
    }
    const res = sanitizeValue(obj)
    expect(res).to.eql({
      a: "foo",
    })
  })

  it("calls toJSON method if present", async () => {
    class Foo {
      toJSON() {
        return {
          foo: "bar",
        }
      }
    }
    const obj = {
      a: new Foo(),
    }
    const res = sanitizeValue(obj)
    expect(res).to.eql({
      a: {
        foo: "bar",
      },
    })
  })

  it("prevents calling sanitizeValue from toSanitizeValue to prevent infinite recursion", async () => {
    class Foo {
      toSanitizedValue() {
        return sanitizeValue({
          foo: "bar",
        })
      }
    }
    const obj = {
      a: new Foo(),
    }
    expect(() => {
      sanitizeValue(obj)
    }).to.throw(
      "`toSanitizedValue` and `toJSON` are not allowed to call `sanitizeValue` because that can cause infinite recursion."
    )
  })

  it("prevents calling sanitizeValue from toJSON to prevent infinite recursion", async () => {
    class Foo {
      toJSON() {
        return sanitizeValue({
          foo: "bar",
        })
      }
    }
    const obj = {
      a: new Foo(),
    }
    expect(() => {
      sanitizeValue(obj)
    }).to.throw(
      "`toSanitizedValue` and `toJSON` are not allowed to call `sanitizeValue` because that can cause infinite recursion."
    )
  })

  it("replaces LogEntry instance on a class instance", async () => {
    class Foo {
      log: Log

      constructor() {
        const log = logger.createLog().info("foo")
        this.log = log
      }
    }

    const obj = {
      a: new Foo(),
    }
    const res = sanitizeValue(obj)
    expect(res).to.eql({
      a: { log: "<Log>" },
    })
  })

  it("replaces joi schemas", async () => {
    const obj = {
      a: joi.object(),
    }
    const res = sanitizeValue(obj)
    expect(res).to.eql({
      a: "<JoiSchema>",
    })
  })
})
