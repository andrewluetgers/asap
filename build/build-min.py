#!/usr/bin/env python

import sys
import re
import os
sys.path.append("../tools")
import jscompiler
import datetime


liscenseFile = 			file("license.txt", "r")
srcFilename = 			"../src/asap-dev.js"
outputFilename = 		"asap"
srcFile = 				open(srcFilename, 'r')
cleaned = 				""
closureCompilerJar = 	"../tools/compiler.jar"
now = 					datetime.datetime.now()
buildDate =				str(now.month)+"/"+str(now.day)+"/"+str(now.year)


# set the build verison
version = input("Please provide a quoted build version eg. '0.5.2': ")
versionRe = re.compile("_buildVersion_")
buildDateRe = re.compile("_buildDate_")
liscenseText = ""
for line in liscenseFile:
	# set the build date
	line = buildDateRe.sub(buildDate, line)
	# set the version
	liscenseText += versionRe.sub(str(version), line)
	

# comment out console.log calls
print "Commenting out any console.log statements"
consoleLogs = re.compile("console\.log")
for line in srcFile:
	theline = consoleLogs.sub("//console.log", line)
	cleaned = cleaned + theline
	
# output the non compressed version
print "Writing to %s" % outputFilename+"-"+version+".js"
file("../"+outputFilename+"-"+version+".js", "w").write(liscenseText + cleaned)
file("../tests/js/"+outputFilename+".js", "w").write(liscenseText + cleaned)

# compile with closure compiler
print "Compressing with closure compiler."
compiled_source = jscompiler.Compile(closureCompilerJar, ["../"+outputFilename+"-"+version+".js"], ["--compilation_level", "SIMPLE_OPTIMIZATIONS"])
	
if compiled_source is None:
	print 'JavaScript compilation failed.'
	sys.exit(1)
else:
	print 'JavaScript compilation succeeded.'
	# concat the code and the liscense text
	minimized = liscenseText + compiled_source

	
print "Writing to %s" % outputFilename+"-"+version+"-min.js"
file("../"+outputFilename+"-"+version+"-min.js", "w").write(minimized)
file("../tests/js/"+outputFilename+"-min.js", "w").write(minimized)

print "Done."
	