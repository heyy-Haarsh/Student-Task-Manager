const fs = require("fs");
const assert = require("assert");

console.log("========================================");
console.log(" Student Task Manager - Automated Tests");
console.log("========================================");

function test(name, callback) {
    try {
        callback();
        console.log(`PASS: ${name}`);
    } catch (error) {
        console.error(`FAIL: ${name}`);
        console.error(error.message);
        process.exit(1);
    }
}

// Test 1
test("index.html exists", () => {
    assert.ok(
        fs.existsSync("index.html"),
        "index.html does not exist"
    );
});

// Test 2
test("app.js exists", () => {
    assert.ok(
        fs.existsSync("app.js"),
        "app.js does not exist"
    );
});

// Test 3
test("task-priority.js exists", () => {
    assert.ok(
        fs.existsSync("task-priority.js"),
        "task-priority.js does not exist"
    );
});

// Test 4
test("index.html contains task input", () => {
    const html = fs.readFileSync("index.html", "utf8");

    assert.ok(
        html.includes('id="taskInput"'),
        "Task input field not found"
    );
});

// Test 5
test("index.html contains task list", () => {
    const html = fs.readFileSync("index.html", "utf8");

    assert.ok(
        html.includes('id="taskList"'),
        "Task list not found"
    );
});

// Test 6
test("app.js contains addTask function", () => {
    const js = fs.readFileSync("app.js", "utf8");

    assert.ok(
        js.includes("function addTask"),
        "addTask function not found"
    );
});

console.log("\n========================================");
console.log(" ALL AUTOMATED TESTS PASSED");
console.log("========================================");