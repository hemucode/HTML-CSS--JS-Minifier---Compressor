var config = {
    'container': {},
    'addon': {
        'homepage': function () {
            return chrome['runtime']['getManifest']()['homepage_url'];
        }
    },
    'codemirror': {
        'editor': {
            'input': null,
            'output': null
        },
        'options': {
            'indentUnit': 2,
            'dragDrop': !![],
            'tabMode': 'indent',
            'lineNumbers': !![],
            'lineWrapping': !![],
            'matchBrackets': !![],
            'mode': 'text/javascript'
        }
    },
    'beautifier': {
        'language': '',
        'options': {
            'eol': '\\n',
            'e4x': ![],
            'indent_size': 2,
            'indent_level': 0,
            'indent_char': ' ',
            'eval_code': ![],
            'comma_first': ![],
            'editorconfig': ![],
            'jslint_happy': ![],
            'wrap_line_length': 0,
            'templating': ['auto'],
            'space_in_paren': ![],
            'brace_style': 'collapse',
            'end_with_newline': ![],
            'indent_with_tabs': ![],
            'unescape_strings': ![],
            'preserve_newlines': !![],
            'indent_empty_lines': ![],
            'max_preserve_newlines': 10,
            'space_in_empty_paren': ![],
            'break_chained_methods': ![],
            'keep_array_indentation': ![],
            'space_before_conditional': !![],
            'unindent_chained_methods': ![],
            'space_after_anon_function': !![],
            'space_after_named_function': ![],
            'operator_position': 'before-newline'
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
        var c = document['getElementById']('clear'), d = document['getElementById']('select'), e = document['getElementById']('fileio'), f = document['getElementById']('reload'), g = document['getElementById']('support'), h = document['getElementById']('language'), i = document['getElementById']('donation'), j = document['getElementById']('download'), k = document['getElementById']('clipboard'), l = document['querySelector']('input[type="file"]'), m = document['getElementById']('beautifybutton');
        e['addEventListener']('click', function () {
            l['click']();
        }, ![]), j['addEventListener']('click', config['app']['download']['result'], ![]), f['addEventListener']('click', function () {
            document['location']['reload']();
        }, ![]), g['addEventListener']('click', function () {
            var n = config['addon']['homepage']();
            chrome['tabs']['create']({
                'url': n,
                'active': !![]
            });
        }, ![]), i['addEventListener']('click', function () {
            var n = config['addon']['homepage']() + '?reason=support';
            chrome['tabs']['create']({
                'url': n,
                'active': !![]
            });
        }, ![]);
        function s(c, d) {
            return b(d - -658, c);
        }
        c['addEventListener']('click', function () {
            config['storage']['write']('reset', ![]), config['codemirror']['editor']['input']['setValue'](''), config['codemirror']['editor']['output']['setValue']('');
        }, ![]), d['addEventListener']('click', function () {
            config['codemirror']['editor']['output'] && config['codemirror']['editor']['output']['execCommand']('selectAll');
        }, ![]), h['addEventListener']('change', function (n) {
            function r(c, d) {
                return b(c - 488, d);
            }
            config['beautifier']['language'] = n['target']['value'], config['storage']['write']('language', config['beautifier'][r(488, 488)]), config['app']['update']['editor']();
        }, ![]), m['addEventListener']('click', function () {
            try {
                var n = config['codemirror']['editor']['input']['getValue']();
                if (n) {
                    var o = config['beautifier']['language']['replace']('text/', '');
                    config['app']['engine'] = o === 'javascript' ? js_beautify : o === 'css' ? css_beautify : html_beautify;
                    var p = config['app']['engine'](n, config['beautifier']['options']);
                    p && config['codemirror']['editor']['output']['setValue'](p);
                }
            } catch (q) {
                window['alert']('An error has occurred! Please change the input language and try again.');
            }
        }, ![]), k['addEventListener']('click', function () {
            if (config['codemirror']['editor']['output']) {
                var n = document['createElement']('textarea');
                d['click'](), document['body']['appendChild'](n), n['value'] = config['codemirror']['editor']['output']['getValue'](), n['select'](), document['execCommand']('copy'), n['remove']();
            }
        }, ![]), l['addEventListener']('change', function (n) {
            n['target'] && (n['target']['files'] && (n['target']['files'][0] && config['app']['file']['process'](n['target']['files'][0], function (o) {
                config['codemirror']['editor']['input']['setValue'](o), window['setTimeout'](function () {
                    m['click']();
                }, 300);
            })));
        }), config[s(-656, -657)]['load'](config['app']['start']), window['removeEventListener']('load', config['load'], ![]);
    },
    'app': {
        'engine': '',
        'show': {
            'error': {
                'message': function (c) {
                    var d = document['getElementById']('fileio'), f = document['getElementById']('beautifybutton');
                    d['disabled'] = ![], f['disabled'] = ![], f['value'] = 'Beautify', config['codemirror']['editor']['output']['setValue'](JSON['stringify'](c, null, 2));
                }
            }
        },
        'reset': {
            'editor': function () {
                var c = config['storage']['read']('reset') !== undefined ? config['storage']['read']('reset') : !![];
                c && fetch('resources/sample.js')['then'](function (d) {
                    return d['text']();
                })['then'](function (d) {
                    d && (config['codemirror']['editor']['input']['setValue'](d), window['setTimeout'](function () {
                        beautifybutton['click']();
                    }, 300));
                })['catch'](function () {
                    config['app']['show']['error']['message']('Error: could not find the input file!');
                });
            }
        },
        'download': {
            'result': function () {
                var c = config['codemirror']['editor']['output']['getValue']();
                if (c) {
                    var d = document['createElement']('a'), e = config['beautifier']['language']['replace']('text/', ''), f = config['app']['file']['name'] ? 'beautified-' + config['app']['file']['name'] : 'result.' + (e === 'javascript' ? 'js' : e);
                    d['style']['display'] = 'none', d['setAttribute']('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(c)), d['setAttribute']('download', f), document['body']['appendChild'](d), d['click'](), window['setTimeout'](function () {
                        d['remove']();
                    }, 0);
                }
            }
        },
        'file': {
            'name': '',
            'process': function (c, d) {
                if (!c)
                    return;
                var e = c['type'];
                config['app']['file']['name'] = c['name'];
                var f = document['getElementById']('language');
                (e === 'text/css' || e === 'text/html' || e === 'text/javascript') && (f['value'] = e, f['dispatchEvent'](new Event('change')));
                var g = new FileReader();
                g['readAsText'](c), g['onload'] = function (h) {
                    var i = h['target']['result'];
                    if (i)
                        d(i);
                };
            }
        },
        'update': {
            'style': function () {
                config['container']['input'] = document['querySelector']('.input'), config['container']['header'] = document['querySelector']('.header'), config['container']['output'] = document['querySelector']('.output');
                var c = parseInt(window['getComputedStyle'](config['container']['header'])['height']);
                config['container']['input']['style']['height'] = window['innerWidth'] < 700 ? 'calc(50vh - ' + (c / 2 + 15) + 'px)' : 'calc(100vh - ' + (c + 15) + 'px)', config['container']['output']['style']['height'] = window['innerWidth'] < 700 ? 'calc(50vh - ' + (c / 2 + 15) + 'px)' : 'calc(100vh - ' + (c + 15) + 'px)';
            },
            'editor': function () {
                try {
                    config['beautifier']['language'] && (config['codemirror']['options']['mode'] = config['beautifier']['language'], config['codemirror']['editor']['input'] && config['codemirror']['editor']['input']['setOption']('mode', config['codemirror']['options']['mode']), config['codemirror']['editor']['output'] && config['codemirror']['editor']['output']['setOption']('mode', config['codemirror']['options']['mode']));
                } catch (c) {
                    config['app']['show']['error']['message'](c);
                }
            }
        },
        'start': function () {
            var c = document['getElementById']('input'), d = document['getElementById']('output'), e = document['getElementById']('language'), f = document['querySelector']('.settings'), g = document['getElementById']('beautifybutton');
            config['container']['inputs'] = [...f['querySelectorAll']('input')], config['beautifier']['language'] = config['storage']['read']('language') !== undefined ? config['storage']['read']('language') : 'text/javascript', config['beautifier']['options'] = config['storage']['read']('options') !== undefined ? config['storage']['read']('options') : config['beautifier']['options'], e['value'] = config['beautifier']['language'], config['codemirror']['options']['mode'] = config['beautifier']['language'], config['codemirror']['editor']['input'] = CodeMirror['fromTextArea'](c, config['codemirror']['options']), config['codemirror']['editor']['output'] = CodeMirror['fromTextArea'](d, config['codemirror']['options']), config['container']['inputs']['map'](function (h) {
                if (h['id'] in config['beautifier']['options']) {
                    var i = h['getAttribute']('type');
                    h[i === 'checkbox' ? 'checked' : 'value'] = config['beautifier']['options'][h['id']];
                }
                h['addEventListener']('change', function (j) {
                    var k = config['beautifier']['options'], l = j['target']['getAttribute']('type');
                    k[j['target']['id']] = j['target'][l === 'checkbox' ? 'checked' : 'value'], config['beautifier']['options'] = k, config['storage']['write']('options', config['beautifier']['options']), g['click']();
                }, ![]);
            }), config['beautifier']['language'] === 'text/javascript' && config['app']['reset']['editor'](), config['app']['update']['style'](), config['app']['update']['editor']();
        }
    }
};
config['port']['connect'](), window['addEventListener'](t(-222, -223), config['load'], ![]);
function t(c, d) {
    return b(d - -225, c);
}
window['addEventListener']('resize', config['resize']['method'], ![]);
function b(c, d) {
    var e = a();
    return b = function (f, g) {
        f = f - 0;
        var h = e[f];
        return h;
    }, b(c, d);
}
function a() {
    var u = [
        'language',
        'storage',
        'load'
    ];
    a = function () {
        return u;
    };
    return a();
}