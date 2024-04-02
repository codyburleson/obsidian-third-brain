import { App, PluginSettingTab, Setting } from "obsidian"
import ThirdBrainPlugin from "./main"

export class ThirdBrainPluginSettingsTab extends PluginSettingTab {
	plugin: ThirdBrainPlugin;

	constructor(app: App, plugin: ThirdBrainPlugin) {
		super(plugin.app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

    new Setting(containerEl)
      .setHeading()
      .setName("API Keys")

		new Setting(containerEl)
			.setName('OpenAI API Key')
			.setDesc(
                `Go to OpenAI's Platform website at platform.openai.com and sign in with your OpenAI account.
                Click "API Keys" in the left-hand navigation, click "Create new secret key".
                Enter your OpenAI API secret key here.`
            )
			.addText(text => text
				.setValue(this.plugin.settings.openAiApiKey)
				.onChange(async (value) => {
					this.plugin.settings.openAiApiKey = value;
					await this.plugin.saveSettings();
				}));
	}
}