
exports.id = 'ti.runscriptphase';
exports.cliVersion = '>=5.0';

exports.init = function (logger, config, cli, appc) {
	cli.on('build.ios.xcodeproject', {
		pre: function (data) {
			const scriptPath = '../../scripts/script-titanium-crashlytics.sh';
			const i18n = appc.i18n(__dirname);
			const __ = i18n.__;

			const builder = this;
			const xcodeProject = data.args[0];

			var xobjs = xcodeProject.hash.project.objects;

			if (typeof builder.generateXcodeUuid !== 'function') {

				let uuidIndex = 1;
				const uuidRegExp = /^(0{18}\d{6})$/;
				const lpad = appc.string.lpad;

				Object.keys(xobjs).forEach(function (section) {
					Object.keys(xobjs[section]).forEach(function (uuid) {
						const m = uuid.match(uuidRegExp);
						const n = m && parseInt(m[1]);
						if (n && n > uuidIndex) {
							uuidIndex = n + 1;
						}
					});
				});

				builder.generateXcodeUuid = function generateXcodeUuid() {
					return lpad(uuidIndex++, 24, '0');
				};
			}

			if (builder.forceRebuild === false) {
				logger.debug(__('Skipping Crashlytics injection for incremental build …'));
				return;
			}

			addScriptBuildPhase(builder, xobjs, scriptPath);
		}
	});
};

function addScriptBuildPhase(builder, xobjs, scriptPath) {
	if (!scriptPath) {
		return;
	}

	const script_uuid = builder.generateXcodeUuid();
	const shell_path = '/bin/sh';
	const shell_script = '/bin/bash \"' + scriptPath + '\"';
	const input_paths = '(\n\t"$(BUILT_PRODUCTS_DIR)/$(INFOPLIST_PATH)"\n)';

	createPBXRunShellScriptBuildPhase(xobjs, script_uuid, shell_path, shell_script, input_paths);
	createPBXRunScriptNativeTarget(xobjs, script_uuid);
}

function createPBXRunShellScriptBuildPhase(xobjs, script_uuid, shell_path, shell_script, input_paths) {
	xobjs.PBXShellScriptBuildPhase = xobjs.PBXShellScriptBuildPhase || {};

	xobjs.PBXShellScriptBuildPhase[script_uuid] = {
		isa: 'PBXShellScriptBuildPhase',
		buildActionMask: '2147483647',
		files: '(\n)',
		inputPaths: input_paths,
		outputPaths: '(\n)',
		runOnlyForDeploymentPostprocessing: 0,
		shellPath: shell_path,
		name: '"[Ti] Crashlytics"',
		shellScript: JSON.stringify(shell_script)
	};
}

function createPBXRunScriptNativeTarget(xobjs, script_uuid) {
	for (const key in xobjs.PBXNativeTarget) {
		xobjs.PBXNativeTarget[key].buildPhases.push({
			value: script_uuid + '',
			comment: '[Ti] Crashlytics'
		});
		return;
	}
}
