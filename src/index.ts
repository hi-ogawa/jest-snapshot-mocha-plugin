import * as assert from "assert";
import type { Context } from "mocha";
import { SnapshotState } from "jest-snapshot";
import type { SnapshotStateType } from "jest-snapshot";
import type {
  SnapshotStateOptions,
  SnapshotMatchOptions,
} from "jest-snapshot/build/State";
import * as path from "path";

const NAME = "jest-snapshot-mocha-plugin";
const SNAPSHOT_EXTENSION = ".snap";

export type ResolveSnapshotPath = (
  testPath: string,
  snapshotExt: string
) => string;

export interface PluginConfig {
  updateSnapshot: boolean;
  resolveSnapshotPath?: ResolveSnapshotPath;
}

export interface PluginState {
  title: string;
  snapshotPath: string;
  snapshotState: SnapshotStateType;
}

export class SnapshotError extends assert.AssertionError {
  constructor(
    result: ReturnType<SnapshotStateType["match"]>,
    snapshotPath: string,
    stackStartFn: Function
  ) {
    super({
      actual: result.actual,
      expected: result.expected,
      operator: "matchSnapshot",
      stackStartFn,
    });

    // Snapshot not found
    if (result.expected === undefined) {
      this.message = `Snapshot not found (${snapshotPath})`;
      return;
    }

    // Generate message via assert equal
    // (Unfortunately jest-snapshot's `printSnapshotAndReceived` is not exported ...)
    try {
      assert.strict.equal(result.actual, result.expected);
    } catch (e: unknown) {
      if (e instanceof Error) {
        // Swap 1st line
        this.message = [
          `Snapshot not match (${snapshotPath})`,
          e.message.split("\n").slice(1),
        ].join("\n");
      }
    }
  }
}

type MochaHooks = {
  beforeEach: (this: Context) => void;
  afterEach: (this: Context) => void;
};

export class JestSnapshotMochaPlugin {
  private state: PluginState | undefined;
  private resolveSnapshotPath: ResolveSnapshotPath;

  constructor(private config: PluginConfig) {
    this.resolveSnapshotPath =
      config.resolveSnapshotPath ?? defaultResolveSnapshotPath;
  }

  matchSnapshot = (actual: unknown): void => {
    if (!this.state) {
      throw new Error(`[${NAME}] no state (possibly due to misconfigurationn)`);
    }
    const { title, snapshotPath, snapshotState } = this.state;

    const matchOptions: SnapshotMatchOptions = {
      received: actual,
      testName: title,
      isInline: false,
    };
    const result = snapshotState.match(matchOptions);
    if (result.pass) return;
    throw new SnapshotError(result, snapshotPath, this.matchSnapshot);
  };

  beforeEach(context: Context): void {
    const test = context.currentTest;
    if (!test) {
      log("no context.currentTest");
      return;
    }

    const file = test.file;
    if (!file) {
      log("no context.currentTest.file");
      return;
    }

    const title = test.fullTitle();
    const snapshotPath = this.resolveSnapshotPath(file, SNAPSHOT_EXTENSION);
    const snapshotOptions: SnapshotStateOptions = {
      updateSnapshot: this.config.updateSnapshot ? "all" : "none",
      // Other flags have been changing between versions,
      // but those are related to inline snapshot feature,
      // so the older verions of jest-snapshot should still work.
      prettierPath: "",
      snapshotFormat: {},
    };
    const snapshotState = new SnapshotState(snapshotPath, snapshotOptions);
    this.state = { title, snapshotPath, snapshotState };
  }

  afterEach(): void {
    if (!this.state) return;

    const { snapshotState } = this.state;
    this.state = undefined;

    // TODO: Does it partially update (e.g. when grepping with -g)?
    snapshotState.save();
  }

  get mochaHooks(): MochaHooks {
    const self = this;
    return {
      beforeEach: function (this: Context) {
        self.beforeEach(this);
      },
      afterEach: function (this: Context) {
        self.afterEach();
      },
    };
  }
}

function defaultResolveSnapshotPath(
  testPath: string,
  snapshotExt: string
): string {
  const testDirname = path.dirname(path.relative(".", testPath));
  const testFileNoExt = path
    .basename(testPath)
    .split(".")
    .slice(0, -1)
    .join(".");
  return path.join(testDirname, "__snapshots__", testFileNoExt + snapshotExt);
}

function log(...args: any): void {
  console.error(`[${NAME}]`, ...args);
}
