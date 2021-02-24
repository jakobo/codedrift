/**
 * Lock: A Unified Locking Library
 * Thanks to the magic of the event stack in Firefox / IE, it is possible to
 * have your data be changed behind your back when using browser window
 * events. A basic lock will help stop that. An object is returned to
 * the requesting application which will say if a lock was obtained or not.
 *
 * This class is licensed under the New BSD License:
 * http://www.opensource.org/licenses/bsd-license.html
 *
 * Copyright (c) 2007 Jakob Heuser (jakob@felocity.org). All rights reserved.
 **/
if (!Lock)
  var Lock = (function() {
    var locks = {};

    var normalize_namespace = function(name) {
      return ("c" + name).replace(/[^a-z0-9\-\_]/gi, "");
    };

    return {
      declare: function() {
        for (var i = 0; i < arguments.length; i++) {
          if (!locks[normalize_namespace(arguments[i])]) {
            locks[normalize_namespace(arguments[i])] = new Array();
          }
        }
      },
      obtain: function(space) {
        // atomic assignment, no 2 objects are same
        var lock = new Object();

        // no namespace? problem
        space = normalize_namespace(space);
        if (!locks[space]) {
          throw "Namespaces must be declared before getting into locks.";
        }

        // atomic op for as long as JS is single threaded
        // whenever JS multi-threads, this one call is synchronized
        locks[space].push(lock);

        // push goes onto end, so no matter how concurrent, we care only
        // about element 0
        var owner = locks[space][0] === lock;

        // safely clean lock_owner
        if (owner) {
          locks[space] = [locks[space][0]];
        }

        var lock_obj = {
          isOwner: function() {
            return owner;
          },
          release: function() {
            if (owner) {
              locks[space] = new Array();
            }
          },
        };

        return lock_obj;
      },
    };
  })();
/*
     FILE ARCHIVED ON 15:52:57 Jul 06, 2010 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 06:08:58 Feb 24, 2020.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  PetaboxLoader3.resolve: 32.422
  PetaboxLoader3.datanode: 8952.87 (4)
  RedisCDXSource: 2.152
  exclusion.robots: 0.194
  CDXLines.iter: 14.887 (3)
  exclusion.robots.policy: 0.178
  LoadShardBlock: 9045.328 (3)
  esindex: 0.01
  load_resource: 55.671
  captures_list: 9065.86
*/
