package jp.co.TechnoloVenus.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class YozoraController {
	@GetMapping("/yozora")
	public String goYozora() {
		return "yozora";
	}
}
