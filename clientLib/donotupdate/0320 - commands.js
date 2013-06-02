_.extend(cmds, {
  /**
   * resovle the property name in the global Object
   * @params {propertyName} property we will try to resolve
   * return the value of the property
   */
  resolve: function (propertyName) {
    if(!_.isString(propertyName)) { throw "provied a correct Path to resolve"; }

    var parts = propertyName.split('.');

    var property = root || window;
    for (var n = 0; n < parts.length; n++) {
      property = property[parts[n]];
        if (property == null) { throw "Reference '" + propertyName + "' not found"; }
    }

    return property;
  },
  /**
   * execute some command available in the Sitecore.Commands namespace 
   * @params {commandName} the name of the command
   * @params {context} the context you want to pass to the command
   */
  executeCommand: function (commandName, context) {
    if (!commandName || !_.isString(commandName)) { throw "cannot execute command without commandName"; }

    var command = cmds.getCommand(commandName);

    if (command.canExecute(context)) {
      command.execute(context);
    }
  },
  /**
   * getCommand avialable
   * @params {commandName} the command you want to retrieve
   * @returns the command
   */
  getCommand: function (commandName) {
    return cmds.resolve(commandName);
  }
});