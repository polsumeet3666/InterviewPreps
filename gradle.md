https://gradle.org/install/
purpose of gradle
a framework for build and deploy application

what gradle do
build deployment artifacts (file)
manage dependencies (any java libs)

xml based tools ant , maven, ivy
groovy based tool gradle

gradle details bottoms up
1. build file (human/machine readable instruction file)
 its declarative and programatic
 uses DSL and groovy
 default name build.gradle
 2. graphs of tasks
 tasks are detail build step
 gradle parse build.gradle file
 gradle create DAG (directed ascyclic graph)
 3. gradle execute task 
 execute task in order of graph
 each task produce output used by next task
 4. manage dependencies
 may have internal dependencies (transitive dependencies)
 need correct version
 5. repository
 storehouse of external dependencies
 6. self updating
 new version of gradle automatically
 auto retrival of dependencies
 
 java plugin for gradle
 makes gradle java aware
 it define task for java build
 many plugins avaliable
 
 build.gradle
 
 	apply plugin: 'java'
 	dependency {
 		compile 'com.google.code.gson:gson:2.8.0'
 		// org:libname:version
 	}
 	repositories {
 		mavenCentral();
 	}
 
cmd for build

	gradle build

Enough groovy for gradle

gradle project object model
java obj built by gradle
use by gradle to build project

project 
1-to-1 relationship to build.gradle
assign project refernce varible

task
project is collection of task
task is collection of actions
actions are functions performed by gradle
actions list task for project


Dependency management
 see all project 
 
 	cmd :  gradle project
 
 see all dependency
 
 	cmd : gradle dependencies
 
 see dependency for perticular configuration (eg. compile)
 
 	cmd : gradle dependencies --configuration compile
 
 export dependency report to html
 add plugin 
 
 	apply plugin: 'project-report'
 
 cmd : gradle htmlDependencyReport
 
 	gradle htmlDependencyReport

	Task :htmlDependencyReport
	See the report at: file:///home/sumeet/IdeaProjects/java-project/build/reports/project/dependencies/index.html

	BUILD SUCCESSFUL in 1s
	1 actionable task: 1 executed

create new library module
create new module in intellj
settings.gradle

	rootProject.name="java-project"
	include 'module-name'
	
root project build.gradle

	dependency {
		compile project(':module-name')
		// :(colon) is for syntax for modules
	}
	
gradle project structure
settings.gradle

	rootProject.name = 'java-project'
	include 'json-display'
	
build.gradle

	plugins {
	    id 'java'
	    id 'project-report'
	}

	group 'info.garagesalesapp'
	version '1.0-SNAPSHOT'

	sourceCompatibility = 1.8

	repositories {
	    mavenCentral()
	}

	dependencies {
	    testCompile group: 'junit', name: 'junit', version: '4.12'
	    compile project(':json-display')
	}

src
--main (main code)
--main/java/
--main/resources

--test (test code)
--test/java/
--test/resources

-- build (output of gradle)
-- build/classes/ ( compiled classess)

--gradle

gradle build directory
build is where gradle execute task and saves to build dir
classes  all compiled code
libs - output for SNAPSHOT.jar
reports - htmlDependencyReport
tmp - temp folder
delete build folder

	cmd : gradle -q clean
	// -q is quite mode it doesnot print more info
	

gradle wrapper
thin layer around gradle
it checks to see if requested version of gradle is installed or not. 
if not it will	
it also passes cmd to gradle
	
	cmd  gradle -q project
	cmd gradlew -q project  both output is same

gradlew is shell sprict
gradlew.bat is for windows
it runs small java program from gradle/wrapper/gradle-wrapper.jar to see if gradle is install correctly or not

install gradle wrapper is not present

	cmd gradle wrapper // brings latest gradle
	cmd gradle wrapper --gradle-version 3.5
	
gradle task
functions performed by gradle

	cmd gradle tasks // list all gradle tasks
	
gradle view tool
is alternate way to run gradle tasks
it has GUI

create new gradle task
in build.gradle file
	
	// standalone task
	task showDate {
	    println('current data is ' + new Date())	
	}
	// task taskname {closure (bit of code)} in groovy
	
	cmd : gradle showDate
	
dependent task
below task is depend on build task. before running showDate it will run build task

	task showDate {
    		dependsOn build
    		doLast {
        		println('current data is ' + new Date())
    		}
	}
	
to see new task in gradle View tool
gradle -> project -> tasks -> other task -> show Date
	