# Spring framework in depth

## Intro
open source,lightweight  
**IoC container**  
- inversion of controller  
- container maintains class dependecies  
- object injected at run time , not compile time  

benefits  
- reduce noise in your code  
- reduce object coupling  

## Application context
- heart of spring application  
- bean factory is values in ref of heart  
- provides all metadata for bean creation  
- provides mechanism to create beans in correct order  
- application context is IoC container, all dependency inject occur here  	  
- handles all singleton beans  

**java based configuration**  
```@Configuration``` class annotation   
```@Bean``` create method of class with this annotation  
```@Value``` constant bean attribute  
```@Autowired```  
```@Import(xx.class)```  


**application.properties**  
```
@Value("${greeting.text}")  
private String greetingtext;
```  
above code will fetch the value of greeting.text from application properties from resource folder and put it into varible
```
@PropertySource("classpath:/application.properties")
``` 
import properties file from classpath under resource folder  
spring give higher precedence to environment varibles on application properties  


**profiles**  
lets you load alternate config variables based on profile(env varibles)  
<code>
@Bean  
@Profile("dev")  
public Shape shapeForDev(){return new Shape("circle");}  
  
@Bean  
@Profile("prod")  
public Shape shapeForProd(){return new Shape("square");}  
</code>
set environment varible as ```spring.profile.active= dev/prod``` ,depending on variable the respective bean will be called  


**sping expression language**  
create application-dev.properties and application-prod.properties in resource folder  
```
@PropertySource("classpath:/application-${spring.profile.active}.properties")  
``` 
```${expression}``` will be executed dynamically

**singleton bean scope**  
one bean per instance , be aware with static data

**prototype bean scope**  
new instance every time you reference , bean defination are stored in factory

**session bean scope**  
aplicable to web application only , one instance of bean per user session  

**request bean scope**  
applicable to web application. one instance per request

```@Scope("singleton")``` is default scope of bean  
```@Scope("prototype")``` this is way to apply different scopes prototype/session/request  

## Annotation based configuration  

```@Component``` indicates that class should be loaded into bean factory  
```@Component and sterotypes``` sterotype can be ```@Controller @Service @Repository```  
dependency inject is achived through ```@Autowired``` annotation  

**autowire bean**  
field level autowiring  
setter injection use for optional dependiency  
constructor injection is prefered level  

**lifecycle methods**  
```@PostConstruct``` after properties on all beans are set this method is called.  
_example_  
<code>
	@PostConstruct  
	public void init(){  
	// do some init code here  
}  
</code>


```@PreDistroy``` is called before disposing bean  
it executes when application context closes  
_example_  
<code>
@PreDistroy  
public void cleanup(){  
	//do some cleanup  
}
</code>  
_note prototype beans are not affected because bean factory dont have handle on beans_  


## XML based configuration  
xml based config is not recommend, but sping 4 still supports  

## Bean Life cycle  
3 phase of life cyele  

1. initalization 
2. use 
3. destruction

