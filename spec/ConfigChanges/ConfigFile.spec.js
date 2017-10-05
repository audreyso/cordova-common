/**
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
*/

var rewire = require('rewire');
var configFile = rewire('../../src/ConfigChanges/ConfigFile');
var fs = require('fs');

describe('ConfigFile tests', function () {

    beforeEach(function () {
        spyOn(configFile, 'isBinaryPlist').and.callThrough();
    });

    it('ConfigFile_save/ConfigFile.prototype.save', function () {
        spyOn(fs, 'writeFileSync');
        configFile.prototype.save();
        expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('isBinaryPlist should return false if not binary', function () {
        spyOn(fs, 'readFileSync').and.returnValue('not bplist');
        expect(configFile.isBinaryPlist('someFile')).toBe(false);
    });
    it('isBinaryPlist should return true if binary', function () {
        spyOn(fs, 'readFileSync').and.returnValue('bplist');
        expect(configFile.isBinaryPlist('someFile')).toBe(true);
    });

    it('getIOSProjectname should throw error', function () {
        expect(function () { configFile.getIOSProjectname('some/project/name'); }).toThrow();
    });

    it('resolveConfigFilePath should return platform file path', function () {
        expect(configFile.resolveConfigFilePath('project_dir', 'platform', 'file')).toBe('project_dir/file');
    });

    it('resolveConfigFilePath should return android file path', function () {
        expect(configFile.resolveConfigFilePath('project_dir', 'android', 'config.xml')).toBe('project_dir/res/xml/config.xml');
    });
    it('resolveConfigFilePath should return ios file path', function () {
        spyOn(configFile, 'getIOSProjectname').and.returnValue('iospath');
        expect(configFile.resolveConfigFilePath('project_dir', 'ios', 'config.xml')).toBe('project_dir/iospath/config.xml');
    });
    it('resolveConfigFilePath should return ubuntu file path', function () {
        expect(configFile.resolveConfigFilePath('project_dir', 'ubuntu', 'config.xml')).toBe('project_dir/config.xml');
    });
});
