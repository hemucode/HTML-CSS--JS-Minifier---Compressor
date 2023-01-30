var config = {
    'iframe': { 'window': document['querySelector']('iframe')['contentWindow'] },
    'addon': {
        'homepage': function () {
            return chrome['runtime']['getManifest']()['homepage_url'];
        }
    },
    'resize': {
        'timeout': null,
        'method': function () {
            if (config['port']['name'] === 'win') {
                if (config['resize']['timeout'])
                    window['clearTimeout'](config['resize']['timeout']);
                config['resize']['timeout'] = window['setTimeout'](async function () {
                    var c = await chrome['windows']['getCurrent']();
                    config['storage']['write']('interface.size', {
                        'top': c['top'],
                        'left': c['left'],
                        'width': c['width'],
                        'height': c['height']
                    });
                }, 1000);
            }
        }
    },
    'port': {
        'name': '',
        'connect': function () {
            config['port']['name'] = 'webapp';
            var c = document['documentElement']['getAttribute']('context');
            if (chrome['runtime']) {
                if (chrome['runtime']['connect']) {
                    if (c !== config['port']['name']) {
                        if (document['location']['search'] === '?tab')
                            config['port']['name'] = 'tab';
                        if (document['location']['search'] === '?win')
                            config['port']['name'] = 'win';
                        chrome['runtime']['connect']({ 'name': config['port']['name'] });
                    }
                }
            }
            document['documentElement']['setAttribute']('context', config['port']['name']);
        }
    },
    'storage': {
        'local': {},
        'read': function (c) {
            return config['storage']['local'][c];
        },
        'load': function (c) {
            chrome['storage']['local']['get'](null, function (d) {
                config['storage']['local'] = d, c();
            });
        },
        'write': function (c, d) {
            if (c) {
                if (d !== '' && d !== null && d !== undefined) {
                    var e = {};
                    e[c] = d, config['storage']['local'][c] = d, chrome['storage']['local']['set'](e, function () {
                    });
                } else
                    delete config['storage']['local'][c], chrome['storage']['local']['remove'](c, function () {
                    });
            }
        }
    },
    'load': function () {
        var c = document['getElementById']('reload'), d = document['getElementById']('support'), e = document['getElementById']('donation');
        c['addEventListener']('click', function () {
            document['location']['reload']();
        }), d['addEventListener']('click', function (f) {
            if (window === window['top']) {
                var g = config['addon']['homepage']();
                chrome['tabs']['create']({
                    'url': g,
                    'active': !![]
                });
            }
        }, ![]), e['addEventListener']('click', function (f) {
            if (window === window['top']) {
                var g = config['addon']['homepage']() + '?reason=support';
                chrome['tabs']['create']({
                    'url': g,
                    'active': !![]
                });
            }
        }, ![]), window['removeEventListener']('load', config['load'], ![]);
    },
    'render': function (c) {
        if (c['data']['from'] === 'sandbox') {
            c['data']['name'] === 'context' && config['iframe']['window']['postMessage']({
                'name': 'context',
                'from': 'app',
                'value': !![]
            }, '*');
            c['data']['name'] === 'project' && fetch('interface/resources/sample.js')['then'](function (f) {
                return f['text']();
            })['then'](function (f) {
                f && config['iframe']['window']['postMessage']({
                    'name': 'result',
                    'from': 'app',
                    'value': f
                }, '*');
            })['catch'](function () {
            });
            if (c['data']['name'] === 'download') {
                var d = document['createElement']('a');
                d['style']['display'] = 'none', d['setAttribute']('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(c['data']['txt'])), d['setAttribute']('download', c['data']['filename']), document['body']['appendChild'](d), d['click'](), window['setTimeout'](function () {
                    d['remove']();
                }, 0);
            }
            c['data']['name'] === 'storage' && (c['data']['action'] === 'remove' && chrome['storage']['local']['remove'](c['data']['id'], function () {
            }), c['data']['action'] === 'set' && chrome['storage']['local']['set'](c['data']['storage'], function () {
            }), c['data']['action'] === 'load' && chrome['storage']['local']['get'](null, function (f) {
                config['iframe']['window']['postMessage']({
                    'name': 'storage',
                    'from': 'app',
                    'action': 'load',
                    'storage': f
                }, '*');
            }));
        }
    }
};
config['port']['connect'](), window['addEventListener']('load', config['load'], ![]), window['addEventListener']('message', config['render'], ![]), window['addEventListener']('resize', config['resize']['method'], ![]);