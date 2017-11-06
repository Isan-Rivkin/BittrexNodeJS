;(function() {

    function Evento() {};

    Evento.prototype = {

        /**
         * Registered events map
         */
        events: {},

        /**
         * Resets all event listeners
         */
        clear: function()
        {
            this.events = {};
        },

        /**
         * Returns all registered events
         */
        getEvents: function()
        {
            return this.events;
        },

        /**
         * Check if event is registered
         */
        hasEvent: function(name)
        {
            return this.events[name] !== undefined;
        },

        //TODO: this needs refactoring!
        isRegistered: function(name, callback, context)
        {
            if (this.hasEvent(name)) {
                for (var i in this.events[name]) {
                    if (this.events[name][i].callback.toString() === callback.toString()) {
                        return true;
                    }
                }
            }
            return false;
        },

        /**
         * Unbind event listener
         *
         * @param {String} name - event name
         */
        off: function(name)
        {
            delete this.events[name];
        },

        /**
         * Bind event listener
         *
         * @param {String} name - event name
         * @param {Function} callback - registered function
         * @param {Object} context - registered object
         */
        on: function(name, callback, context)
        {
            if (!this.hasEvent(name)) {
                this.events[name] = [];
            }
            if (!this.isRegistered(name, callback, context)) {
                this.events[name].push({
                    callback: callback,
                    context : context
                });
            }
        },

        /**
         * Triggers registered event.
         * If event is not registered do nothing.
         *
         * @param {String} name - event name
         * @param {mixed} args - custom messages passed to subscriber
         */
        trigger: function(name, args)
        {
            if (this.hasEvent(name)) {
                for (var i in this.events[name]) {
                    this.triggerOne(this.events[name][i], args);
                }
            }
        },

        //TODO: this needs refactoring!
        triggerOne: function(event, args)
        {
            event.context === undefined ?
                event.callback(args) :
                event.callback.apply(event.context, [args]);
        }
    };

    /**
     * Singleton instance
     */
    Evento.instance = null;

    /**
     * Singleton initiation
     */
    Evento.getInstance = function() {

        if (this.instance === null) {
            this.instance = new Evento();
        }
        return this.instance;
    };

    if ((typeof module != 'undefined') && (module.exports)) { // Node Module

        module.exports = Evento.getInstance();

    } else if (typeof define != 'undefined' && define.hasOwnProperty('amd') && define.amd) { // RequireJS AMD

        define(function(){
            return Evento.getInstance();
        });

    } else if (typeof window != 'undefined') { // Fall back to attaching to window

        window.Evento = Evento.getInstance();
    };
}.call(this));