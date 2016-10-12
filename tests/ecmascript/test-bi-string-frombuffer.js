/*
 *  String.fromBuffer() provided by the "duk" command.
 *
 *  NOTE: String.fromBuffer() is -not- part of the default built-ins.  It is
 *  provided by "duk" command to support testcases which need to deal with
 *  the internal string representation.
 */

/*@include util-buffer.js@*/
/*@include util-string.js@*/

/*---
{
    "custom": true
}
---*/

/*===
TypeError
TypeError
TypeError
TypeError
TypeError
TypeError
TypeError
TypeError
TypeError
TypeError
TypeError
TypeError
TypeError
TypeError
TypeError
TypeError
TypeError
"\u07ad\xbe\xef"
string "<U+07AD><Error>"
|deadbeef|
"\xff\ue74c"
string "<Error><U+E74C><U+074C><Error>"
|ffeeddcc|
"abcd"
string "abcd"
|61626364|
"\x00\x01\x02\xfe\xff"
string "<U+0000><U+0001><U+0002><Error><Error>"
|000102feff|
"\xff\xff\xff\xffxV4\x12\u03ba\xfe\xca"
string "<Error><Error><Error><Error>xV4<U+0012><U+03BA><Error><Error><Error>"
|ffffffff78563412cefafeca|
"\x00\x00\x00\x00\x00\x00\x00\x00\x9a\x99\x99\x99\x99\x99\xb9?\x9a\x99\x99\x99\x99\x99\u067f\x00\x00\x00\x00\x00\x00\u0ff333333\u3fc0\x00\x00\x00\x00\x00\U0003f9a6ffff\U001bf000\x00\x00\x00\x00\U00fda659\x99\x99\x99\U01fc0000\x00\x00@\x8f@"
string "<U+0000><U+0000><U+0000><U+0000><U+0000><U+0000><U+0000><U+0000>?<U+067F>?<U+0000><U+0000><U+0000><U+0000><U+0000><U+0000><U+0FF3>?333333<U+3FC0>?<U+0000><U+0000><U+0000><U+0000><U+0000><U+0000><U+F9A6>?ffffff<U+F000>?<U+0000><U+0000><U+0000><U+0000><U+0000><U+0000><U+A659>?<U+0000>?<U+0000><U+0000><U+0000><U+0000><U+0000>@@"
|00000000000000009a9999999999b93f9a9999999999d93f000000000000e03f333333333333e33f000000000000f03f666666666666f63f000000000000f83f9a9999999999f93f0000000000408f40|
"\x04\x00\x05\x00\x06\x00\x07\x00"
string "<U+0004><U+0000><U+0005><U+0000><U+0006><U+0000><U+0007><U+0000>"
|0400050006000700|
===*/

function test() {
    var arrayBuf = new ArrayBuffer(4);
    arrayBuf[0] = 0xff;
    arrayBuf[1] = 0xee;
    arrayBuf[2] = 0xdd;
    arrayBuf[3] = 0xcc;

    [
        // All of these are rejected
        void 0, null, true, false, 'foo', '123',
        -1, 0, 1, 4.4, 4.5, 4.6, 128,
        'foo\ucafe\ufacebar',
        [ 0xde, 0xad, 0xbe, 0xef, '123', '234', '1234' ],
        { length: 4, 0: 100, 1: 101, 2: 102, 3: 103, 4: 104 },
        { 0: 100, 1: 101 },

        // Plain buffers are accepted
        Duktape.dec('hex', 'deadbeef'),

        // Buffer objects are accepted, active byte slice is used
        // (not element slice)
        arrayBuf,
        new Buffer('abcd'),
        new Uint8Array([ 0, 1, 2, 0xfe, 0xff ]),
        new Int32Array([ -1, 0x12345678, 0xcafeface ]),
        new Float64Array([ 0.0, 0.1, 0.4, 0.5, 0.6, 1.0, 1.4, 1.5, 1.6, 1000 ]),
        new Uint16Array([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]).subarray(3, 7)
    ].forEach(function (v) {
        try {
            var p = String.fromBuffer(v);
            print(Duktape.enc('jx', p));
            print(typeof p, safeEscapeString(p));
            print(Duktape.enc('jx', stringToBuffer(p)));
        } catch (e) {
            print(e.name);
        }
    });
}

try {
    test();
} catch (e) {
    print(e.stack || e);
}
