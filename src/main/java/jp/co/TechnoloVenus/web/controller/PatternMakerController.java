package jp.co.TechnoloVenus.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PatternMakerController {
	@GetMapping("/pattern_maker")
	public String goPattern_maker() {
		return "pattern_maker";
	}
}
