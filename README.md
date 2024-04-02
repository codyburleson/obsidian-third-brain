# Obsidian Third Brain Plugin

This is the development vault for the Obsidian 3rd Brain Plugin

For getting started with plugin development, [.obsidian/plugins/third-brain/README.md](.obsidian/plugins/third-brain/README.md).

## About

The Obsidian Third Brain Plugin is my personal A.I. study and practice project which seeks to apply A.I. agents and Large Language Models (LLMs) to personal and professional knowledge management.

### The Basic Idea

The basic idea is simple:

Given a personal or professional knowledge vault (comprised of Obsidian markdown documents), with various information architectures (information schemes or structures understood by A.I. agents), apply the power of Large Language Models to enhance knowledge management.

## The Basic Technical Approach

OpenAI doesn't execute any code, it just determines which functions it should use in a given scenario, and then leaves it up to our plugin to invoke those functions.

The basic approach for how each internal agent is defined is documented here:

[How to build an agent with the OpenAI Node.js SDK](https://cookbook.openai.com/examples/how_to_build_an_agent_with_the_node_sdk)

This is currently imp