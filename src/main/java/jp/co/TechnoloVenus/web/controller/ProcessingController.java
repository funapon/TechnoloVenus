package jp.co.TechnoloVenus.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * colorful_ballページのURLを定義するクラス
 */
@Controller
@RequestMapping("/processing")
public class ProcessingController {
	/**
	 * processingページのhtmlファイル名を返すメソッド
	 * @return htmlファイル名
	 */	
	@GetMapping
	public String goProcessing() {
		return "processing";
	}
	/**
	 * colorful_ballページのhtmlファイル名を返すメソッド
	 * @return htmlファイル名
	 */
	@GetMapping("/colorful_ball")
	public String goColorful_ball() {
		return "processing/colorful_ball";
	}   
}
