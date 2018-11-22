## Spring MVC


### JEE Application stack
**_below stack should refer from bottom to down_**

* View (JSP context) | Data (RDBMS)
* JEE servlet (servlet context) | 	EJB context
* JEE web application (servlet engine , tomcat)
* JVM (java application)

### Spring aware JEE Application
**_below stack should refer from bottom to down_**

* View | Data | Service
* Spring front controller (dispatcher servlet)
* Spring application root context
* JEE web application (servlet engine , tomcat)
* JVM (java application)

### Request Dispatching

* dispatcher servlet
	* Handler Mapping
	* Controller
		* Service
			* Data access
			* Email
			* SMS
	* View Resolvers
	* Theme Resolvers
	* Locale Resolvers	 

### Web MVC Project setup
* import guide project (serving web content)
* rename project name in pom.xml,folder,.project
* Development plan
	1. controllers
	2. model/services
	3. view

### Spring MVC controller
* @Controller annotation and handler annotation (@GetMapping/@PostMapping)
* handler can return login view names 

### Request Mapping (Method input signatures)
* @GetMapping(path="/quoteRequests")
* @GetMapping(path="/quoteRequests",params="!eventType")
* @GetMapping("/quoteRequest/{quoteId}")
  public String viewQuoteRequest(@PathVariable int quoteId)
* @PostMapping("/quoteDetail")
  public String updateQuoteRequest(@ModelAttribute QuoteRequest fromBean) 

* _Quick Review_
	1. @RequestParams
	2. @PathVariable
	3. @ModelAttribute
	4. 25+ method input signature

### Method return values
* String (logical view name)
* ModelAndView or View
* Redirect or Forward
* @ResponseBody
* 15+ total supported return values

### Model Methods
* @ModelAttribute
* Model methods are always called before controller handler

### Binder Methods
* Init Binder
* @InitBinder

### Controller Advice
* it will apply to every request of every controller
* @ControllerAdvice


## View MVC
* view resolver is responsible to find view name to actual resource
  prefix + viewName + sufix
  eg '/resource/template/' + 'newQuote' + '.html'


@RestController
@RequestMapping("/api")
public class ApiController {

	private RoomServices roomServices;
	
	@Autowired
	public ApiController(RoomServices roomServices) {
		this.roomServices = roomServices;
	}
	
	@GetMapping("/rooms")
	public ArrayList<Room> getAllRooms(){
		return roomServices.getAllRooms();
	}
	
}


@Controller
@RequestMapping("/rooms")
public class RoomController {

	private RoomServices roomServices;
	
	@Autowired
	public RoomController(RoomServices roomServices) {
		this.roomServices = roomServices;
	}
	
	@GetMapping
	public String getAllRooms(Model model) {
		
		model.addAttribute("rooms",roomServices.getAllRooms());
		return "rooms";
	}
}


@Service
public class RoomServices {

	private static ArrayList<Room> rooms = new ArrayList<>();
	
		static {
			for(int i=0;i<10;i++) {
				rooms.add(new Room("Room"+i,"R"+i,"Q"));
			}
		}
		
	public ArrayList<Room> getAllRooms(){
		return rooms;
	}	
	
}


## Packing Spring boot app
* produces Fat jar means it contains src code + all dependencies
* jar is executable
* spring boot also support war

## Running Spring boot app
* java -jar jarname
* shell scripts
* systemd or init.d

## Command line Application
* command line runner interface
* application runner interface
* @Order - to order multiple runners

## Create a clr app (command line runner app)
* start.spring.io create project with any dependences
* add below in pom.xml
* spring-web,jackson-core,jackson-databind

	<dependency>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter</artifactId>
	</dependency>

	<dependency>
		<groupId>org.springframework</groupId>
		<artifactId>spring-web</artifactId>
	</dependency>

	<dependency>
		<groupId>com.fasterxml.jackson.core</groupId>
		<artifactId>jackson-core</artifactId>
	</dependency>
	<dependency>
		<groupId>com.fasterxml.jackson.core</groupId>
		<artifactId>jackson-databind</artifactId>
	</dependency>

@Component
public class RoomCleaningPrimer implements CommandLineRunner {

	private RestTemplate restTemplate;
	
	public RoomCleaningPrimer() {
		this.restTemplate = new RestTemplate();
	}
	
	@Override
	public void run(String... args) throws Exception {
		
		String url = "http://localhost:8080/api/rooms";
		Room[] roomArray  = restTemplate.getForObject(url, Room[].class);
		List rooms =  (List) Arrays.asList(roomArray);
		((Iterable<Room>) rooms).forEach(System.out::println);
	}

}

* change run config
_Note: rest controller should be up and running_

## Spirng Boot Data
* support both sql and nosql dbs 
* Sping Data Project
* data.sql and schema.sql will automatically loaded

* add below dependency in pom.xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
	<groupId>com.h2database</groupId>
	<artifactId>h2</artifactId>
	<scope>runtime</scope>
</dependency>

* in application.properties
spring.jpa.hibernate.ddl-auto=none
* above code tells hibernate to not generate sql as we have our own
* annotation are from javax.persistance
@Entity
@Table(name="ROOM")
public class Room {
	
	@Id
	@Column(name="ROOM_ID")
	@GeneratedValue
	private long id;
	@Column(name="NAME")
	private String name;
	@Column(name="ROOM_NUMBER")
	private String number;
	@Column(name="BED_INFO")
	private String info;
	
	public Room() {
		super();
	}
	//.. below are getter/setters
}

@Repository
public interface RoomRepository extends CrudRepository<Room, Long> {

}

@Service
public class RoomServices {

	private RoomRepository roomRepository;
	
	@Autowired
	public RoomServices(RoomRepository roomRepository) {
		super();
		this.roomRepository = roomRepository;
	}
	public List<Room> getAllRooms(){
		
		List<Room> rooms = new ArrayList<>();
		this.roomRepository.findAll().forEach(rooms::add);
		return rooms;
	}	
	
}

http://localhost:8080/api/rooms

## Spring Security
* implement in memory secuirty
* add below dependency in pom.xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-security</artifactId>
</dependency>

@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		
		http.authorizeRequests().antMatchers("/","/api/*").permitAll()
		.anyRequest().authenticated()
		.and()
		.formLogin()
		.loginPage("/login")
		.permitAll()
		.and()
		.logout()
		.permitAll();
	}
	
	@Autowired
	public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
		auth.inMemoryAuthentication().withUser("user").password("{noop}password").roles("USER");
	}
}

**{noop} is required as default no operation password NoOpPasswordEncoder**

<!DOCTYPE html>
<html>
<head xmlns:td="http://www.thymeleaf.org">
<meta charset="UTF-8"/>
<title>Hotel | Login</title>
</head>
<body>
	<form th:action="@{/login}" method="post">
		<div>
			<label>Username : <input type="text" name="username"/>
			</label>
			<label>Password : <input type="password" name="password" />
			</label>
		</div>
		<div>
			<input type="submit" value="login"/> 
		</div>
	</form>
</body>
</html>

@Controller
public class AdminController {
	
	@GetMapping("/login")
	public String getLoginPage() {
		return "login";
	}
}


## AMQP with spring boot

### RabbitMQ Consumer
* start.spring.io init project with AMQP dependency
* import project and add below lines in application.properties
amqp.queue.name=room-cleaner
amqp.exchange.name=landon-hotel-exchange


@Component
public class RoomCleanerProcessor {
	
	private final ObjectMapper objectMapper;
	private static final Logger LOGGER = LoggerFactory.getLogger(RoomCleanerProcessor.class);
	
	@Autowired
	public RoomCleanerProcessor(ObjectMapper objectMapper) {
		this.objectMapper = objectMapper;
	}
	
	public void recieveMessage(String roomJson) {
		LOGGER.info("recieved message");
		try {
			Room room = this.objectMapper.readValue(roomJson, Room.class);
			LOGGER.info("room ready for cleaning ",room.getNumber());
		} catch (IOException e) {
			LOGGER.error("Exception",e);
		}
		
	}
	
}



@SpringBootApplication
public class RoomCleanerConsumerApplication {

	@Value("${amqp.queue.name}")
	private String queueName;
	
	@Value("${amqp.exchange.name}")
	private String exchangeName;
	
	@Bean
	public Queue queue() {
		return new Queue(queueName,false);
	}
	
	@Bean
	public TopicExchange topicExchange() {
		return new TopicExchange(exchangeName);
	}
	
	@Bean
	public Binding binding(Queue queue,TopicExchange topicExchange) {
		return BindingBuilder.bind(queue).to(topicExchange).with(queueName);
	}
	
	
	@Bean
	public MessageListenerAdapter listenerAdapter(RoomCleanerProcessor cleanerProcessor) {
		return new MessageListenerAdapter(cleanerProcessor,"recieveMessage");
	}
	
	@Bean
	public SimpleMessageListenerContainer container(org.springframework.amqp.rabbit.connection.ConnectionFactory connectionFactory,MessageListenerAdapter listenerAdapter) {
		
		SimpleMessageListenerContainer container = new SimpleMessageListenerContainer();
		container.setConnectionFactory(connectionFactory);
		container.setQueueNames(queueName);
		container.setMessageListener(listenerAdapter);
		
		return container;
	}
	
	public static void main(String[] args) {
		SpringApplication.run(RoomCleanerConsumerApplication.class, args);
	}
}

### RabbitMQ Producer

@Component
public class RoomCleaningPrimer implements CommandLineRunner {

	private RestTemplate restTemplate;
	
	@Value("${amqp.queue.name}")
	private String queueName;
	
	private static final Logger LOGGER =  LoggerFactory.getLogger(RoomCleaningPrimer.class);
	private final RabbitTemplate rabbitTemplate;
	private final ConfigurableApplicationContext context;
	private final ObjectMapper objectMapper;
	
	@Autowired
	public RoomCleaningPrimer(RabbitTemplate rabbitTemplate,ConfigurableApplicationContext context,ObjectMapper objectMapper) {
		this.restTemplate = new RestTemplate();
		this.rabbitTemplate = rabbitTemplate;
		this.context = context;
		this.objectMapper = objectMapper;
	}
	
	@Override
	public void run(String... args) throws Exception {
		
		String url = "http://localhost:8080/api/rooms";
		Room[] roomArray  = restTemplate.getForObject(url, Room[].class);
		List rooms =  (List) Arrays.asList(roomArray);
//		((Iterable<Room>) rooms).forEach(System.out::println);
		rooms.forEach(room -> {
			
			try {
				String jsonString = objectMapper.writeValueAsString(room);
				LOGGER.info(jsonString);
				LOGGER.info("Sending Message",jsonString);
				 rabbitTemplate.convertAndSend(queueName,jsonString);
			} catch (JsonProcessingException e) {
				LOGGER.error("parsing error ",e);
			}
		});
		
		context.close();
	}

}


@SpringBootApplication
public class RoomClrAppApplication {
	
	@Value("${amqp.queue.name}")
	private String queueName;
	
	@Value("${amqp.exchange.name}")
	private String exchangeName;
	
	@Bean
	public Queue queue() {
		return new Queue(queueName,false);
	}
	
	@Bean
	public TopicExchange topicExchange() {
		return new TopicExchange(exchangeName);
	}
	
	@Bean
	public Binding binding(Queue queue,TopicExchange topicExchange) {
		return BindingBuilder.bind(queue).to(topicExchange).with(queueName);
	}

	public static void main(String[] args) {
		SpringApplication.run(RoomClrAppApplication.class, args);
	}
}



@Component
public class RoomCleanerProcessor {
	
	private final ObjectMapper objectMapper;
	private static final Logger LOGGER = LoggerFactory.getLogger(RoomCleanerProcessor.class);
	
	@Autowired
	public RoomCleanerProcessor(ObjectMapper objectMapper) {
		this.objectMapper = objectMapper;
	}
	
	public void recieveMessage(String roomJson) {
		LOGGER.info("recieved message");
		try {
			LOGGER.info(roomJson);
			Room room = objectMapper.readValue(roomJson, Room.class);
			LOGGER.info("room ready for cleaning "+ room.getNumber());
		} catch (IOException e) {
			LOGGER.error("Exception",e);
		}
		
	}
	
}